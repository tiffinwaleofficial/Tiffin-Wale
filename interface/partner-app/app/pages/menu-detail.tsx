import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Edit,
  Trash2,
  UtensilsCrossed,
  PlusCircle,
} from 'lucide-react-native';
import { api, Menu, MenuItem } from '../../lib/api';
import MenuForm from '../../components/MenuForm';

const MenuDetailScreen = () => {
  const router = useRouter();
  const { menuId } = useLocalSearchParams<{ menuId: string }>();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    loadMenuData();
  }, [menuId]);

  const loadMenuData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load menu with items
      const menuData = await api.menu.getMenuById(menuId);
      setMenu(menuData);
      
      // Load all menus for the form
      const menusData = await api.menu.getMyMenus();
      setMenus(menusData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load menu');
      console.error('Failed to load menu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    setSelectedMenuItem(null);
    setFormVisible(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setFormVisible(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await api.menu.deleteMenuItem(id);
      await loadMenuData();
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleSaveItem = () => {
    setFormVisible(false);
    setSelectedMenuItem(null);
    loadMenuData();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItemCard}>
      <View style={styles.menuItemImageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.menuItemImage}
            resizeMode="cover"
          />
        ) : item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.menuItemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.menuItemImage, styles.imagePlaceholder]}>
            <UtensilsCrossed size={40} color="#CCC" />
          </View>
        )}
        {(item.images && item.images.length > 1) && (
          <View style={styles.imageCountBadge}>
            <Text style={styles.imageCountText}>+{item.images.length - 1}</Text>
          </View>
        )}
      </View>

      <View style={styles.menuItemContent}>
        <View style={styles.menuItemHeader}>
          <View style={styles.menuItemTitleContainer}>
            <Text style={styles.menuItemName} numberOfLines={1}>{item.name}</Text>
            {item.description && (
              <Text style={styles.menuItemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
          <Text style={styles.menuItemPrice}>{formatCurrency(item.price)}</Text>
        </View>

        <View style={styles.menuItemMeta}>
          <View style={styles.badgesContainer}>
            {item.isVegetarian && (
              <View style={[styles.badge, styles.vegetarianBadge]}>
                <Text style={[styles.badgeText, styles.vegetarianText]}>Vegetarian</Text>
              </View>
            )}
            {item.isVegan && (
              <View style={[styles.badge, styles.veganBadge]}>
                <Text style={[styles.badgeText, styles.veganText]}>Vegan</Text>
              </View>
            )}
            {item.isGlutenFree && (
              <View style={[styles.badge, styles.glutenFreeBadge]}>
                <Text style={[styles.badgeText, styles.glutenFreeText]}>Gluten Free</Text>
              </View>
            )}
            {item.spiceLevel && (
              <View style={[styles.badge, styles.spiceBadge]}>
                <Text style={[styles.badgeText, styles.spiceText]}>{item.spiceLevel}</Text>
              </View>
            )}
            <View style={[
              styles.badge,
              item.isAvailable ? styles.availableBadge : styles.unavailableBadge
            ]}>
              <Text style={[
                styles.badgeText,
                item.isAvailable ? styles.availableText : styles.unavailableText
              ]}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => handleEditItem(item)}
              style={[styles.actionButton, styles.editButton]}
            >
              <Edit size={18} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteItem(item._id || item.id || '')}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Trash2 size={18} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }

  if (error || !menu) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error || 'Menu not found'}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const items = menu.items || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backIconButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{menu.name}</Text>
          {menu.description && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {menu.description}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handleAddItem}
          style={styles.addButton}
        >
          <PlusCircle size={28} color="#FF9F43" />
        </TouchableOpacity>
      </View>

      {/* Menu Info */}
      <View style={styles.menuInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Items:</Text>
          <Text style={styles.infoValue}>{items.length}</Text>
        </View>
        {menu.availableFrom && menu.availableTo && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Available:</Text>
            <Text style={styles.infoValue}>{menu.availableFrom} - {menu.availableTo}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: menu.isActive ? '#DCFCE7' : '#FEF3C7' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: menu.isActive ? '#10B981' : '#F59E0B' }
            ]}>
              {menu.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>

      {/* Items List */}
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderMenuItem}
          keyExtractor={(item) => (item._id || item.id || '').toString()}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <UtensilsCrossed size={64} color="#CCC" />
          <Text style={styles.emptyText}>No items in this menu</Text>
          <Text style={styles.emptySubText}>
            Add your first item to get started
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleAddItem}
          >
            <Text style={styles.emptyButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Menu Form Modal */}
      <MenuForm
        isVisible={isFormVisible}
        onClose={() => {
          setFormVisible(false);
          setSelectedMenuItem(null);
        }}
        onSave={handleSaveItem}
        menuItem={selectedMenuItem || (menu ? { menu: menu._id || menu.id } as MenuItem : null)}
        menus={menus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF8E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInfo: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginRight: 8,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    gap: 12,
  },
  menuItemCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  menuItemImageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  menuItemImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
  },
  menuItemContent: {
    padding: 12,
  },
  menuItemHeader: {
    marginBottom: 8,
  },
  menuItemTitleContainer: {
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 16,
  },
  menuItemPrice: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FF9F43',
    marginTop: 4,
  },
  menuItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  vegetarianBadge: {
    backgroundColor: '#DCFCE7',
  },
  vegetarianText: {
    color: '#10B981',
  },
  veganBadge: {
    backgroundColor: '#D1FAE5',
  },
  veganText: {
    color: '#059669',
  },
  glutenFreeBadge: {
    backgroundColor: '#E0E7FF',
  },
  glutenFreeText: {
    color: '#3B82F6',
  },
  spiceBadge: {
    backgroundColor: '#FEE2E2',
  },
  spiceText: {
    color: '#DC2626',
  },
  availableBadge: {
    backgroundColor: '#DCFCE7',
  },
  unavailableBadge: {
    backgroundColor: '#FEF3C7',
  },
  availableText: {
    color: '#10B981',
  },
  unavailableText: {
    color: '#F59E0B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#E3F2FD',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF9F43',
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#F44336',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF9F43',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default MenuDetailScreen;

