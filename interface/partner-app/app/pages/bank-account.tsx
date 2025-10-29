import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Building2,
  Hash,
  User,
  Smartphone,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  Edit,
  CheckCircle,
  AlertCircle,
  Copy,
} from 'lucide-react-native';
import { usePartnerStore } from '../../store/partnerStore';
import { api } from '../../lib/api';

const BankAccountScreen = () => {
  const router = useRouter();
  const { profile, stats, fetchProfile, fetchStats } = usePartnerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [earningsData, setEarningsData] = useState<any>(null);

  // Bank Account Fields
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [accountType, setAccountType] = useState('');
  const [upiId, setUpiId] = useState('');
  const [panNumber, setPanNumber] = useState('');

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
    if (!stats) {
      fetchStats();
    }
    loadEarningsData();
  }, []);

  useEffect(() => {
    if (profile?.bankAccount) {
      setAccountHolderName(profile.bankAccount.accountHolderName || '');
      setAccountNumber(profile.bankAccount.accountNumber || '');
      setIfscCode(profile.bankAccount.ifscCode || '');
      setBankName(profile.bankAccount.bankName || '');
      setBranch(profile.bankAccount.branch || '');
      setAccountType(profile.bankAccount.accountType || 'Savings');
      setUpiId(profile.bankAccount.upiId || '');
      setPanNumber(profile.bankAccount.panNumber || '');
    }
  }, [profile]);

  const loadEarningsData = async () => {
    try {
      const earnings = await api.analytics.getEarnings('all');
      setEarningsData(earnings);
    } catch (error) {
      console.error('Failed to load earnings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchProfile(),
      fetchStats(),
      loadEarningsData(),
    ]);
    setRefreshing(false);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const updateData = {
        bankAccount: {
          accountHolderName,
          accountNumber,
          ifscCode,
          bankName,
          branch,
          accountType,
          upiId,
          panNumber,
        },
      };

      await api.partner.updateProfile(updateData);
      await fetchProfile();
      setIsEditing(false);
      alert('Bank account details updated successfully!');
    } catch (error) {
      console.error('Failed to update bank account:', error);
      alert('Failed to update bank account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber || accountNumber.length < 4) return accountNumber;
    return '****' + accountNumber.slice(-4);
  };

  const copyToClipboard = (text: string, label: string) => {
    // Show the full text in an alert for copying
    alert(`${label}: ${text}\n\nLong press to copy`);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (!profile) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }

  const totalEarnings = earningsData?.totalEarnings || stats?.totalRevenue || 0;
  const totalOrders = earningsData?.totalOrders || stats?.totalOrders || 0;
  const commission = earningsData?.commission || (totalEarnings * (profile.commissionRate || 20) / 100);
  const netEarnings = totalEarnings - commission;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Account & Payouts</Text>
        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          style={styles.editButton}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF9F43" />
          ) : isEditing ? (
            <CheckCircle size={24} color="#10B981" />
          ) : (
            <Edit size={24} color="#FF9F43" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF9F43']} />
        }
      >
        {/* Earnings Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Earnings Overview</Text>
          </View>

          <View style={styles.earningsGrid}>
            <View style={styles.earningCard}>
              <Text style={styles.earningLabel}>Total Earnings</Text>
              <Text style={styles.earningValue}>{formatCurrency(totalEarnings)}</Text>
              <Text style={styles.earningSubtext}>{totalOrders} orders</Text>
            </View>
            <View style={styles.earningCard}>
              <Text style={styles.earningLabel}>Platform Fee</Text>
              <Text style={[styles.earningValue, { color: '#F59E0B' }]}>
                {formatCurrency(commission)}
              </Text>
              <Text style={styles.earningSubtext}>{profile.commissionRate}% rate</Text>
            </View>
            <View style={[styles.earningCard, styles.netEarningsCard]}>
              <Text style={styles.earningLabel}>Net Earnings</Text>
              <Text style={[styles.earningValue, { color: '#10B981', fontSize: 24 }]}>
                {formatCurrency(netEarnings)}
              </Text>
              <Text style={styles.earningSubtext}>After commission</Text>
            </View>
          </View>
        </View>

        {/* Bank Account Status */}
        <View style={styles.section}>
          <View style={styles.statusContainer}>
            {profile.bankAccount?.accountNumber ? (
              <View style={styles.statusBanner}>
                <CheckCircle size={20} color="#10B981" />
                <View style={styles.statusContent}>
                  <Text style={styles.statusTitle}>Account Verified</Text>
                  <Text style={styles.statusText}>
                    Your bank account is linked and ready for payouts
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[styles.statusBanner, styles.warningBanner]}>
                <AlertCircle size={20} color="#F59E0B" />
                <View style={styles.statusContent}>
                  <Text style={[styles.statusTitle, { color: '#F59E0B' }]}>
                    Bank Account Not Linked
                  </Text>
                  <Text style={styles.statusText}>
                    Please add your bank details to receive payouts
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Bank Account Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Building2 size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Bank Account Details</Text>
          </View>

          {isEditing ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Holder Name</Text>
                <TextInput
                  style={styles.input}
                  value={accountHolderName}
                  onChangeText={setAccountHolderName}
                  placeholder="Full name as per bank account"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Number</Text>
                <TextInput
                  style={styles.input}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="Bank account number"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>IFSC Code</Text>
                  <TextInput
                    style={styles.input}
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    placeholder="IFSC Code"
                    placeholderTextColor="#999"
                    autoCapitalize="characters"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Account Type</Text>
                  <View style={styles.accountTypePicker}>
                    <TouchableOpacity
                      style={[
                        styles.accountTypeOption,
                        accountType === 'Savings' && styles.accountTypeActive,
                      ]}
                      onPress={() => setAccountType('Savings')}
                    >
                      <Text
                        style={[
                          styles.accountTypeText,
                          accountType === 'Savings' && styles.accountTypeTextActive,
                        ]}
                      >
                        Savings
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.accountTypeOption,
                        accountType === 'Current' && styles.accountTypeActive,
                      ]}
                      onPress={() => setAccountType('Current')}
                    >
                      <Text
                        style={[
                          styles.accountTypeText,
                          accountType === 'Current' && styles.accountTypeTextActive,
                        ]}
                      >
                        Current
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Bank Name</Text>
                  <TextInput
                    style={styles.input}
                    value={bankName}
                    onChangeText={setBankName}
                    placeholder="Bank name"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Branch</Text>
                  <TextInput
                    style={styles.input}
                    value={branch}
                    onChangeText={setBranch}
                    placeholder="Branch name"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </>
          ) : profile.bankAccount?.accountNumber ? (
            <>
              <View style={styles.infoRow}>
                <User size={18} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Account Holder</Text>
                  <Text style={styles.infoValue}>
                    {profile.bankAccount.accountHolderName || 'Not provided'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Hash size={18} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Account Number</Text>
                  <View style={styles.copyRow}>
                    <Text style={styles.infoValue}>
                      {maskAccountNumber(profile.bankAccount.accountNumber)}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        copyToClipboard(
                          profile.bankAccount?.accountNumber || '',
                          'Account number'
                        )
                      }
                      style={styles.copyButton}
                    >
                      <Copy size={16} color="#FF9F43" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Building2 size={18} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Bank & Branch</Text>
                  <Text style={styles.infoValue}>
                    {profile.bankAccount.bankName || 'Not provided'}
                    {profile.bankAccount.branch && ` - ${profile.bankAccount.branch}`}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Hash size={18} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>IFSC Code</Text>
                  <View style={styles.copyRow}>
                    <Text style={styles.infoValue}>
                      {profile.bankAccount.ifscCode || 'Not provided'}
                    </Text>
                    {profile.bankAccount.ifscCode && (
                      <TouchableOpacity
                        onPress={() =>
                          copyToClipboard(
                            profile.bankAccount?.ifscCode || '',
                            'IFSC code'
                          )
                        }
                        style={styles.copyButton}
                      >
                        <Copy size={16} color="#FF9F43" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.infoRow}>
                <CreditCard size={18} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Account Type</Text>
                  <Text style={styles.infoValue}>
                    {profile.bankAccount.accountType || 'Not specified'}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <CreditCard size={48} color="#CCC" />
              <Text style={styles.emptyText}>No bank account added</Text>
              <Text style={styles.emptySubText}>
                Add your bank account to receive payouts
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.addButtonText}>Add Bank Account</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* UPI Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Smartphone size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>UPI Details (Optional)</Text>
          </View>

          {isEditing ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>UPI ID</Text>
              <TextInput
                style={styles.input}
                value={upiId}
                onChangeText={setUpiId}
                placeholder="yourname@upi"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>
          ) : profile.bankAccount?.upiId ? (
            <View style={styles.infoRow}>
              <Smartphone size={18} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>UPI ID</Text>
                <View style={styles.copyRow}>
                  <Text style={styles.infoValue}>{profile.bankAccount.upiId}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(profile.bankAccount?.upiId || '', 'UPI ID')
                    }
                    style={styles.copyButton}
                  >
                    <Copy size={16} color="#FF9F43" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.emptySubText}>No UPI ID added</Text>
          )}
        </View>

        {/* Tax Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Tax Information</Text>
          </View>

          {isEditing ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PAN Number</Text>
              <TextInput
                style={styles.input}
                value={panNumber}
                onChangeText={setPanNumber}
                placeholder="ABCDE1234F"
                placeholderTextColor="#999"
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>
          ) : profile.bankAccount?.panNumber ? (
            <View style={styles.infoRow}>
              <FileText size={18} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>PAN Number</Text>
                <Text style={styles.infoValue}>{profile.bankAccount.panNumber}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptySubText}>No PAN number added</Text>
          )}
        </View>

        {/* Payout Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#EC4899" />
            <Text style={styles.sectionTitle}>Payout Information</Text>
          </View>

          <View style={styles.payoutInfoGrid}>
            <View style={styles.payoutInfoCard}>
              <Text style={styles.payoutInfoLabel}>Commission Rate</Text>
              <Text style={styles.payoutInfoValue}>{profile.commissionRate}%</Text>
            </View>
            <View style={styles.payoutInfoCard}>
              <Text style={styles.payoutInfoLabel}>Payout Cycle</Text>
              <Text style={styles.payoutInfoValue}>Weekly</Text>
            </View>
            <View style={styles.payoutInfoCard}>
              <Text style={styles.payoutInfoLabel}>Next Payout</Text>
              <Text style={styles.payoutInfoValue}>Sunday</Text>
            </View>
            <View style={styles.payoutInfoCard}>
              <Text style={styles.payoutInfoLabel}>Min Payout</Text>
              <Text style={styles.payoutInfoValue}>₹500</Text>
            </View>
          </View>
        </View>

        {/* Financial Summary */}
        {!isEditing && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Financial Summary</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Earnings (Lifetime)</Text>
                <Text style={styles.summaryValue}>{formatCurrency(totalEarnings)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Platform Commission</Text>
                <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
                  - {formatCurrency(commission)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { fontFamily: 'Poppins-Bold', color: '#333' }]}>
                  Net Earnings
                </Text>
                <Text style={[styles.summaryValue, { fontFamily: 'Poppins-Bold', color: '#10B981', fontSize: 20 }]}>
                  {formatCurrency(netEarnings)}
                </Text>
              </View>
            </View>

            <View style={styles.helpNote}>
              <AlertCircle size={16} color="#666" />
              <Text style={styles.helpNoteText}>
                Earnings are calculated after deducting {profile.commissionRate}% platform commission.
                Payouts are processed weekly to your linked bank account.
              </Text>
            </View>
          </View>
        )}

        {/* Help Section */}
        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              If you have questions about payouts, commissions, or need to update your bank details,
              please contact our support team.
            </Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => router.push('/pages/help-support')}
            >
              <Text style={styles.contactButtonText}>Contact Support</Text>
              <ArrowRight size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  earningsGrid: {
    gap: 12,
  },
  earningCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  netEarningsCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  earningLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 8,
  },
  earningValue: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 4,
  },
  earningSubtext: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#999',
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  warningBanner: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#10B981',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF9F43',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  accountTypePicker: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  accountTypeOption: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  accountTypeActive: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FF9F43',
  },
  accountTypeText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  accountTypeTextActive: {
    color: '#FF9F43',
    fontFamily: 'Poppins-SemiBold',
  },
  payoutInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  payoutInfoCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    width: '47%',
    alignItems: 'center',
  },
  payoutInfoLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 6,
  },
  payoutInfoValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  helpNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  helpNoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#92400E',
    lineHeight: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F43',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
  },
});

export default BankAccountScreen;

