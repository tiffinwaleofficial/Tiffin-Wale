import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '@/config/api';
import { toast } from 'sonner';

export default function CollectionViewerModal({ open, onOpenChange, collectionName }) {
    const [documents, setDocuments] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [deleting, setDeleting] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    useEffect(() => {
        if (open && collectionName) {
            fetchDocuments();
        }
    }, [open, collectionName, page]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(
                `/super-admin/system/collections/${collectionName}/documents`,
                { params: { page, limit: 50 } }
            );
            setDocuments(response.data.documents || []);
            setTotal(response.data.total || 0);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Failed to load collection data');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            const allIds = new Set(documents.map(doc => doc._id?.toString() || doc.id?.toString()));
            setSelectedIds(allIds);
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id, checked) => {
        const newSelected = new Set(selectedIds);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedIds(newSelected);
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) {
            toast.error('Please select documents to delete');
            return;
        }

        setDeleting(true);
        try {
            await apiClient.delete(`/super-admin/system/collections/${collectionName}/documents`, {
                data: { ids: Array.from(selectedIds) },
            });

            toast.success(`Deleted ${selectedIds.size} document(s) successfully`);
            setSelectedIds(new Set());
            setConfirmDeleteOpen(false);

            // Refresh documents
            await fetchDocuments();
        } catch (error) {
            console.error('Error deleting documents:', error);
            toast.error('Failed to delete documents');
        } finally {
            setDeleting(false);
        }
    };

    // Get column headers from first document
    const getHeaders = () => {
        if (documents.length === 0) return [];

        const firstDoc = documents[0];
        return Object.keys(firstDoc).filter(key => {
            // Show all fields, but truncate large objects/arrays in display
            return true;
        });
    };

    const formatValue = (value) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'object') {
            return JSON.stringify(value).substring(0, 100) + (JSON.stringify(value).length > 100 ? '...' : '');
        }
        if (typeof value === 'boolean') return value.toString();
        return String(value);
    };

    const isAllSelected = documents.length > 0 && selectedIds.size === documents.length;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Collection: {collectionName}</DialogTitle>
                        <DialogDescription>
                            Viewing {documents.length} of {total} documents
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setConfirmDeleteOpen(true)}
                                disabled={selectedIds.size === 0}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Selected ({selectedIds.size})
                            </Button>
                            <Button variant="outline" size="sm" onClick={fetchDocuments} disabled={loading}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || loading}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No documents found in this collection
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                    <tr>
                                        <th className="p-2 text-left border-b">
                                            <Checkbox
                                                checked={isAllSelected}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </th>
                                        {getHeaders().map((header) => (
                                            <th key={header} className="p-2 text-left border-b font-semibold">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc, idx) => {
                                        const docId = doc._id?.toString() || doc.id?.toString() || idx.toString();
                                        return (
                                            <tr
                                                key={docId}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b"
                                            >
                                                <td className="p-2">
                                                    <Checkbox
                                                        checked={selectedIds.has(docId)}
                                                        onCheckedChange={(checked) => handleSelectOne(docId, checked)}
                                                    />
                                                </td>
                                                {getHeaders().map((header) => (
                                                    <td key={header} className="p-2 max-w-xs truncate" title={formatValue(doc[header])}>
                                                        {formatValue(doc[header])}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            <div className="space-y-2">
                                <p className="font-semibold text-red-600">Warning: This action is irreversible!</p>
                                <p>
                                    Are you sure you want to delete <strong>{selectedIds.size}</strong> selected document(s) from the "{collectionName}" collection?
                                </p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteSelected}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
