import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  PlusCircle,
  Edit,
  Trash2,
  ChevronRight,
  UtensilsCrossed,
  Package,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react-native';
import { useTheme } from '../../store/themeStore';
import { api, MenuItem, SubscriptionPlan, Menu } from '../../lib/api';
import MenuForm from '../../components/MenuForm';
import MenuGroupForm from '../../components/MenuGroupForm';
import PlanForm from '../../components/PlanForm';

type TabType = 'menus' | 'items' | 'plans';

const MenuManagementScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('menus');
  const [menuGroups, setMenuGroups] = useState<Menu[]>([]);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setFormVisible] = useState(false);
  const [isMenuGroupFormVisible, setMenuGroupFormVisible] = useState(false);
  const [isPlanFormVisible, setPlanFormVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedMenuGroup, setSelectedMenuGroup] = useState<Menu | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (activeTab === 'menus' || activeTab === 'items') {
        // Load menus with their items (items are already included in menus from API)
        const menusData = await api.menu.getMyMenus();
        setMenuGroups(menusData || []);
        
        // Extract all items from all menus for the "All Items" tab
        const allItemsFromMenus = (menusData || []).flatMap((menu: Menu) => 
          menu.items || []
        );
        setAllMenuItems(allItemsFromMenus);
        
        // Expand all menus by default
        if (menusData && menusData.length > 0) {
          setExpandedMenus(new Set(menusData.map(m => m._id || m.id || '').filter(Boolean)));
        }
      } else if (activeTab === 'plans') {
        const plansData = await api.plans.getMyPlans();
        setPlans(plansData || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenuExpansion = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const getItemsForMenu = (menuId: string): MenuItem[] => {
    if (!menuId) return [];
    
    // Normalize menu ID for comparison (handle both ObjectId and string formats)
    const normalizeId = (id: any): string => {
      if (!id) return '';
      const str = id.toString().trim();
      // Remove any ObjectId wrapper if present
      return str.replace(/^ObjectId\(["']?([^"']+)["']?\)$/, '$1');
    };
    
    const menuIdNormalized = normalizeId(menuId);
    
    const filtered = allMenuItems.filter(item => {
      const itemMenuId = normalizeId(item.menu);
      // Compare normalized IDs (case-insensitive and handle both formats)
      const matches = itemMenuId.toLowerCase() === menuIdNormalized.toLowerCase();
      return matches;
    });
    
    return filtered;
  };

  const handleAddMenuGroup = () => {
    setSelectedMenuGroup(null);
    setMenuGroupFormVisible(true);
  };

  const handleEditMenuGroup = (menu: Menu) => {
    setSelectedMenuGroup(menu);
    setMenuGroupFormVisible(true);
  };

  const handleDeleteMenuGroup = async (id: string) => {
    try {
      await api.menu.deleteMenu(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete menu. Make sure it has no items.');
    }
  };

  const handleSaveMenuGroup = () => {
    setMenuGroupFormVisible(false);
    setSelectedMenuGroup(null);
    loadData();
  };

  const handleAddItem = (menuId?: string) => {
    setSelectedMenuItem({ ...selectedMenuItem, menu: menuId } as MenuItem);
    setFormVisible(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setFormVisible(true);
  };
  
  const handleDeleteItem = async (id: string) => {
    try {
      await api.menu.deleteMenuItem(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleSaveItem = async () => {
    setFormVisible(false);
    setSelectedMenuItem(null);
    // Force refresh data after a short delay to ensure backend has saved
    setTimeout(() => {
      loadData();
    }, 500);
  };

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setPlanFormVisible(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPlanFormVisible(true);
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await api.plans.deletePlan(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete plan:', err);
    }
  };

  const handleSavePlan = () => {
    setPlanFormVisible(false);
    setSelectedPlan(null);
    loadData();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const renderMenuItemCard = (item: MenuItem) => (
    <View style={styles.menuItemCard}>
      {/* Image */}
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
          <View style={[styles.menuItemImage, styles.menuItemImagePlaceholder]}>
            <UtensilsCrossed size={24} color="#CCC" />
          </View>
        )}
        {(item.images && item.images.length > 1) && (
          <View style={styles.imageCountBadge}>
            <Text style={styles.imageCountText}>+{item.images.length - 1}</Text>
          </View>
        )}
      </View>
      
      {/* Content */}
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.menuItemPrice}>
          {formatCurrency(item.price)}
        </Text>
        
        {/* Badges Row */}
        <View style={styles.menuItemBadges}>
          {item.isVegetarian && (
            <View style={styles.vegBadge}>
              <Text style={styles.vegBadgeText}>Veg</Text>
            </View>
          )}
          {item.spiceLevel && (
            <View style={styles.spiceBadge}>
              <Text style={styles.spiceBadgeText}>{item.spiceLevel}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.menuItemActions}>
          <TouchableOpacity
            onPress={() => handleEditItem(item)}
            style={styles.editIconButton}
          >
            <Edit size={14} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteItem(item._id || item.id || '')}
            style={styles.deleteIconButton}
          >
            <Trash2 size={14} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderMenuGroup = ({ item: menu }: { item: Menu }) => {
    const menuId = menu._id || menu.id || '';
    const isExpanded = expandedMenus.has(menuId);
    // Use items directly from menu object (already filtered by API)
    // Fallback to getItemsForMenu for backward compatibility
    const items = menu.items || getItemsForMenu(menuId);

    return (
      <View style={styles.menuGroupContainer}>
        {/* Menu Header */}
        <TouchableOpacity
          style={styles.menuGroupHeader}
          onPress={() => toggleMenuExpansion(menuId)}
        >
          <View style={styles.menuGroupHeaderLeft}>
            {menu.images && menu.images.length > 0 ? (
              <Image
                source={{ uri: menu.images[0] }}
                style={styles.menuGroupImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.menuGroupImage, styles.menuGroupImagePlaceholder]}>
                <FolderOpen size={24} color="#FF9F43" />
              </View>
            )}
            <View style={styles.menuGroupInfo}>
              <Text style={[styles.menuGroupName, { color: '#333' }]}>{menu.name}</Text>
              {menu.description && (
                <Text style={[styles.menuGroupDescription, { color: '#666' }]} numberOfLines={1}>
                  {menu.description}
                </Text>
              )}
              <View style={styles.menuGroupMeta}>
                <Text style={[styles.itemCount, { color: '#999' }]}>
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </Text>
                {menu.availableFrom && menu.availableTo && (
                  <Text style={[styles.timeRange, { color: '#666' }]}>
                    {menu.availableFrom} - {menu.availableTo}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.menuGroupHeaderRight}>
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
            <TouchableOpacity
              onPress={() => handleEditMenuGroup(menu)}
              style={[styles.actionButton, styles.smallButton, { backgroundColor: '#E3F2FD' }]}
            >
              <Edit size={16} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleDeleteMenuGroup(menuId);
              }}
              style={[styles.actionButton, styles.smallButton, { backgroundColor: '#FFEBEE' }]}
            >
              <Trash2 size={16} color="#F44336" />
            </TouchableOpacity>
            {isExpanded ? (
              <ChevronUp size={20} color="#666" />
            ) : (
              <ChevronDown size={20} color="#666" />
            )}
          </View>
        </TouchableOpacity>

        {/* Menu Items */}
        {isExpanded && (
          <View style={styles.menuItemsContainer}>
            {items.length > 0 ? (
              <>
                <View style={styles.menuItemsHeader}>
                  <Text style={[styles.menuItemsTitle, { color: '#333' }]}>
                    Items ({items.length})
                  </Text>
                  {items.length > 6 && (
                    <TouchableOpacity
                      style={styles.viewAllButtonCompact}
                      onPress={() => router.push(`/pages/menu-detail?menuId=${menuId}`)}
                    >
                      <Text style={[styles.viewAllTextCompact, { color: '#FF9F43' }]}>
                        View All
                      </Text>
                      <ArrowRight size={14} color="#FF9F43" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.menuItemsGrid}>
                  {items.slice(0, 6).map((item) => (
                    <View key={item._id || item.id}>
                      {renderMenuItemCard(item)}
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.emptyMenuItems}>
                <Text style={[styles.emptyText, { color: '#999' }]}>
                  No items in this menu
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() => handleAddItem(menuId)}
            >
              <PlusCircle size={20} color="#FF9F43" />
              <Text style={[styles.addItemText, { color: '#FF9F43' }]}>
                Add Item to {menu.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderPlan = ({ item }: { item: SubscriptionPlan }) => {
    const mealSpec = api.plans.parseMealSpecification(item);
    
    return (
      <TouchableOpacity
        style={[styles.planContainer, { backgroundColor: '#FFF' }]}
        onPress={() => handleEditPlan(item)}
      >
        <View style={styles.planHeader}>
          <View style={styles.planHeaderLeft}>
            <Package size={24} color="#FF9F43" />
            <View style={styles.planTitleContainer}>
              <Text style={[styles.planName, { color: '#333' }]}>{item.name}</Text>
              <Text style={[styles.planPrice, { color: '#FF9F43' }]}>
                {item.discountedPrice ? (
                  <>
                    <Text style={styles.originalPrice}>{formatCurrency(item.price)}</Text>
                    {' '}{formatCurrency(item.discountedPrice)}
                  </>
                ) : (
                  formatCurrency(item.price)
                )}
                {' / '}{item.durationValue} {item.durationType}
              </Text>
            </View>
          </View>
          <View style={styles.planActions}>
            <TouchableOpacity
              onPress={() => handleEditPlan(item)}
              style={[styles.actionButton, { backgroundColor: '#E3F2FD' }]}
            >
              <Edit size={18} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeletePlan(item._id || item.id || '')}
              style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
            >
              <Trash2 size={18} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>

        {item.description && (
          <Text style={[styles.planDescription, { color: '#666' }]} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.planDetails}>
          <View style={styles.planDetailRow}>
            <Text style={[styles.detailLabel, { color: '#666' }]}>Meals:</Text>
            <Text style={[styles.detailValue, { color: '#333' }]}>
              {item.mealsPerDay} per day
            </Text>
          </View>
          <View style={styles.planDetailRow}>
            <Text style={[styles.detailLabel, { color: '#666' }]}>Frequency:</Text>
            <Text style={[styles.detailValue, { color: '#333' }]}>
              {item.mealFrequency}
            </Text>
          </View>
        </View>

        {mealSpec && (
          <View style={styles.mealSpecContainer}>
            <Text style={[styles.mealSpecTitle, { color: '#333' }]}>Meal Details:</Text>
            <View style={styles.mealSpecGrid}>
              {mealSpec.rotis !== undefined && (
                <View style={styles.mealSpecItem}>
                  <UtensilsCrossed size={16} color="#F59E0B" />
                  <Text style={[styles.mealSpecText, { color: '#666' }]}>
                    {mealSpec.rotis} Roti{mealSpec.rotis > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
              {mealSpec.sabzis && mealSpec.sabzis.length > 0 && (
                <View style={styles.mealSpecItem}>
                  <UtensilsCrossed size={16} color="#10B981" />
                  <Text style={[styles.mealSpecText, { color: '#666' }]}>
                    {mealSpec.sabzis.length} Sabzi{mealSpec.sabzis.length > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
              {mealSpec.dal && (
                <View style={styles.mealSpecItem}>
                  <UtensilsCrossed size={16} color="#3B82F6" />
                  <Text style={[styles.mealSpecText, { color: '#666' }]}>
                    {mealSpec.dal.type}
                  </Text>
                </View>
              )}
              {mealSpec.rice && (
                <View style={styles.mealSpecItem}>
                  <UtensilsCrossed size={16} color="#8B5CF6" />
                  <Text style={[styles.mealSpecText, { color: '#666' }]}>
                    {mealSpec.rice.quantity} Rice
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.planStatusContainer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.isActive ? '#DCFCE7' : '#FEF3C7',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: item.isActive ? '#10B981' : '#F59E0B',
                },
              ]}
            >
              {item.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <ChevronRight size={20} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && (menuGroups.length === 0 && allMenuItems.length === 0 && plans.length === 0)) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: '#FEF6E9' }]}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#FEF6E9' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#333' }]}>Menu & Plans</Text>
        <TouchableOpacity
          onPress={
            activeTab === 'menus'
              ? handleAddMenuGroup
              : activeTab === 'items'
              ? () => handleAddItem()
              : handleAddPlan
          }
          style={styles.addButton}
        >
          <PlusCircle color="#FF9F43" size={28} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'menus' && styles.activeTab]}
          onPress={() => setActiveTab('menus')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'menus' && styles.activeTabText,
            ]}
          >
            Menus
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'items' && styles.activeTabText,
            ]}
          >
            All Items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'plans' && styles.activeTab]}
          onPress={() => setActiveTab('plans')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'plans' && styles.activeTabText,
            ]}
          >
            Plans
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {activeTab === 'menus' ? (
        <FlatList
          key={`menus-${activeTab}`}
          data={menuGroups}
          renderItem={renderMenuGroup}
          keyExtractor={(item) => (item._id || item.id || '').toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FolderOpen size={48} color="#CCC" />
              <Text style={[styles.emptyText, { color: '#666' }]}>
                No menus created yet
              </Text>
              <Text style={[styles.emptySubText, { color: '#999' }]}>
                Create your first menu (Breakfast, Lunch, Dinner, etc.) to organize your items
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleAddMenuGroup}
              >
                <Text style={styles.emptyButtonText}>Create Menu</Text>
              </TouchableOpacity>
            </View>
          }
          refreshing={isLoading}
          onRefresh={loadData}
        />
      ) : activeTab === 'items' ? (
      <FlatList
          key={`items-${activeTab}`}
          data={allMenuItems}
          renderItem={({ item }) => renderMenuItemCard(item)}
          keyExtractor={(item) => (item._id || item.id || '').toString()}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.menuItemsGrid}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
              <UtensilsCrossed size={48} color="#CCC" />
              <Text style={[styles.emptyText, { color: '#666' }]}>
                No menu items found
              </Text>
              <Text style={[styles.emptySubText, { color: '#999' }]}>
                Add items to your menus
              </Text>
          </View>
        }
          refreshing={isLoading}
          onRefresh={loadData}
        />
      ) : (
        <FlatList
          key={`plans-${activeTab}`}
          data={plans}
          renderItem={renderPlan}
          keyExtractor={(item) => (item._id || item.id || '').toString()}
        contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Package size={48} color="#CCC" />
              <Text style={[styles.emptyText, { color: '#666' }]}>
                No subscription plans found
              </Text>
              <Text style={[styles.emptySubText, { color: '#999' }]}>
                Create plans like ₹2500, ₹4000, etc.
              </Text>
            </View>
          }
          refreshing={isLoading}
          onRefresh={loadData}
        />
      )}

      {/* Modals */}
      <MenuGroupForm
        isVisible={isMenuGroupFormVisible}
        onClose={() => {
          setMenuGroupFormVisible(false);
          setSelectedMenuGroup(null);
        }}
        onSave={handleSaveMenuGroup}
        menu={selectedMenuGroup}
      />

        <MenuForm
          isVisible={isFormVisible}
        onClose={() => {
          setFormVisible(false);
          setSelectedMenuItem(null);
        }}
        onSave={handleSaveItem}
          menuItem={selectedMenuItem}
        menus={menuGroups}
      />

      <PlanForm
        isVisible={isPlanFormVisible}
        onClose={() => {
          setPlanFormVisible(false);
          setSelectedPlan(null);
        }}
        onSave={handleSavePlan}
        plan={selectedPlan}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeTab: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FF9F43',
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#FF9F43',
    fontFamily: 'Poppins-SemiBold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  menuGroupContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  menuGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuGroupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  menuGroupImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  menuGroupImagePlaceholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuGroupInfo: {
    flex: 1,
  },
  menuGroupName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  menuGroupDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 6,
  },
  menuGroupMeta: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  timeRange: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  menuGroupHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    position: 'relative',
  },
  menuItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  menuItemCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 10,
    width: 110,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  menuItemImageContainer: {
    position: 'relative',
    width: '100%',
    height: 85,
  },
  menuItemImage: {
    width: '100%',
    height: '100%',
  },
  menuItemImagePlaceholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
  },
  imageCountText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
  },
  menuItemContent: {
    padding: 8,
  },
  menuItemName: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
    lineHeight: 14,
  },
  menuItemPrice: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FF9F43',
    marginBottom: 6,
  },
  menuItemBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginBottom: 6,
  },
  vegBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vegBadgeText: {
    fontSize: 8,
    fontFamily: 'Poppins-SemiBold',
    color: '#10B981',
  },
  spiceBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  spiceBadgeText: {
    fontSize: 8,
    fontFamily: 'Poppins-SemiBold',
    color: '#DC2626',
  },
  menuItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  editIconButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIconButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  menuItemsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  viewAllButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF8E6',
    borderRadius: 8,
    gap: 4,
  },
  viewAllTextCompact: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
    backgroundColor: '#FFF8E6',
    borderRadius: 8,
    gap: 8,
  },
  addItemText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyMenuItems: {
    padding: 24,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 20,
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
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#F44336',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  planContainer: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  planTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  planActions: {
    flexDirection: 'row',
    gap: 8,
  },
  planDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  planDetails: {
    marginBottom: 12,
  },
  planDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  detailValue: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },
  mealSpecContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  mealSpecTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  mealSpecGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealSpecItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  mealSpecText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  planStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default MenuManagementScreen;
