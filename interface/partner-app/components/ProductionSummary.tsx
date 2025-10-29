import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Package, TrendingUp, CheckCircle, UtensilsCrossed } from 'lucide-react-native';
import type { ProductionSummary as ProductionSummaryType } from '../lib/api';

interface ProductionSummaryProps {
  summary: ProductionSummaryType;
}

export const ProductionSummary: React.FC<ProductionSummaryProps> = ({ summary }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.statCard}>
          <Package size={24} color="#FF9F43" />
          <Text style={styles.statValue}>{summary.totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>

        <View style={styles.statCard}>
          <CheckCircle size={24} color="#10B981" />
          <Text style={styles.statValue}>{summary.completionPercentage}%</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Meal Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meal Breakdown</Text>
        <View style={styles.mealGrid}>
          <View style={[styles.mealCard, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.mealEmoji}>🌅</Text>
            <Text style={styles.mealCount}>{summary.mealBreakdown.breakfast}</Text>
            <Text style={styles.mealLabel}>Breakfast</Text>
          </View>

          <View style={[styles.mealCard, { backgroundColor: '#DBEAFE' }]}>
            <Text style={styles.mealEmoji}>☀️</Text>
            <Text style={styles.mealCount}>{summary.mealBreakdown.lunch}</Text>
            <Text style={styles.mealLabel}>Lunch</Text>
          </View>

          <View style={[styles.mealCard, { backgroundColor: '#E0E7FF' }]}>
            <Text style={styles.mealEmoji}>🌙</Text>
            <Text style={styles.mealCount}>{summary.mealBreakdown.dinner}</Text>
            <Text style={styles.mealLabel}>Dinner</Text>
          </View>
        </View>
      </View>

      {/* Ingredient Totals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🥘 Ingredients to Prepare</Text>

        {/* Rotis */}
        {summary.ingredientTotals.rotis > 0 && (
          <View style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>🫓 Rotis/Chapatis</Text>
            <Text style={styles.ingredientQuantity}>
              {summary.ingredientTotals.rotis} pieces
            </Text>
          </View>
        )}

        {/* Sabzis */}
        {Object.keys(summary.ingredientTotals.sabzis).length > 0 && (
          <View style={styles.ingredientGroup}>
            <Text style={styles.ingredientGroupTitle}>Sabzis (Vegetables):</Text>
            {Object.entries(summary.ingredientTotals.sabzis).map(([name, count]) => (
              <View key={name} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>  • {name}</Text>
                <Text style={styles.ingredientQuantity}>{count} portions</Text>
              </View>
            ))}
          </View>
        )}

        {/* Dal */}
        {summary.ingredientTotals.dal.total > 0 && (
          <View style={styles.ingredientGroup}>
            <Text style={styles.ingredientGroupTitle}>
              🍲 Dal: {summary.ingredientTotals.dal.total} bowls
            </Text>
            {Object.entries(summary.ingredientTotals.dal.types).map(([type, count]) => (
              <View key={type} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>  • {type} dal</Text>
                <Text style={styles.ingredientQuantity}>{count} portions</Text>
              </View>
            ))}
          </View>
        )}

        {/* Rice */}
        {summary.ingredientTotals.rice.total > 0 && (
          <View style={styles.ingredientGroup}>
            <Text style={styles.ingredientGroupTitle}>
              🍚 Rice: {summary.ingredientTotals.rice.total} portions
            </Text>
            {Object.entries(summary.ingredientTotals.rice.types).map(([type, count]) => (
              <View key={type} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>  • {type} rice</Text>
                <Text style={styles.ingredientQuantity}>{count} portions</Text>
              </View>
            ))}
          </View>
        )}

        {/* Extras */}
        {Object.keys(summary.ingredientTotals.extras).length > 0 && (
          <View style={styles.ingredientGroup}>
            <Text style={styles.ingredientGroupTitle}>Extras:</Text>
            {Object.entries(summary.ingredientTotals.extras).map(([name, count]) => (
              <View key={name} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>  • {name}</Text>
                <Text style={styles.ingredientQuantity}>{count} portions</Text>
              </View>
            ))}
          </View>
        )}

        {/* Salad & Curd */}
        <View style={styles.ingredientRow}>
          {summary.ingredientTotals.salad > 0 && (
            <Text style={styles.ingredientName}>🥗 Salad: {summary.ingredientTotals.salad}</Text>
          )}
          {summary.ingredientTotals.curd > 0 && (
            <Text style={styles.ingredientName}>🥛 Curd: {summary.ingredientTotals.curd}</Text>
          )}
        </View>
      </View>

      {/* Plan-wise Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Plan-wise Orders</Text>
        {Object.entries(summary.planBreakdown).map(([planName, data]: [string, any]) => (
          <View key={planName} style={styles.planRow}>
            <Text style={styles.planName}>{planName}</Text>
            <Text style={styles.planCount}>{data.count} orders</Text>
          </View>
        ))}
      </View>

      {/* Status Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Status Overview</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusCard}>
            <Text style={styles.statusCount}>{summary.statusBreakdown.pending}</Text>
            <Text style={[styles.statusLabel, { color: '#EF4444' }]}>Pending</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusCount}>{summary.statusBreakdown.preparing}</Text>
            <Text style={[styles.statusLabel, { color: '#6366F1' }]}>Preparing</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusCount}>{summary.statusBreakdown.ready}</Text>
            <Text style={[styles.statusLabel, { color: '#F59E0B' }]}>Ready</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusCount}>{summary.statusBreakdown.outForDelivery}</Text>
            <Text style={[styles.statusLabel, { color: '#3B82F6' }]}>Out</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusCount}>{summary.statusBreakdown.delivered}</Text>
            <Text style={[styles.statusLabel, { color: '#10B981' }]}>Delivered</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#333',
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  mealGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  mealCard: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    gap: 6,
  },
  mealEmoji: {
    fontSize: 28,
  },
  mealCount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333',
  },
  mealLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#666',
  },
  ingredientGroup: {
    marginBottom: 12,
  },
  ingredientGroupTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  ingredientName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#666',
  },
  ingredientQuantity: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#FF9F43',
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  planName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  planCount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FF9F43',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusCard: {
    width: '18%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  statusCount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 4,
  },
  statusLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default ProductionSummary;


