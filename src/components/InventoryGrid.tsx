import { useState, useMemo, Fragment } from 'react';
import { ArrowUpDown } from 'lucide-react';
import styles from './InventoryDisplay.module.css';
import { Column, DatabaseUserData, DataItem, SortConfig } from '../types';

interface InventoryGridProps {
  data: DataItem[];
  columns: Column[];
  groupIdentical: boolean;
  currentInventory: DatabaseUserData;
}

interface SortOption {
  value: string;
  label: string;
}

interface GroupedDataItem extends DataItem {
  quantity?: number;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({
  data,
  columns,
  groupIdentical,
  currentInventory
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: '',
    direction: 'asc'
  });

  const sortOptions: SortOption[] = useMemo(() =>
    columns.map(col => ({
      value: col.key,
      label: col.label
    }))
    , [columns]);

  const sortedData = useMemo(() => {
    let processed: GroupedDataItem[] = [...data];
    if (sortConfig.key) {
      processed.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (valueA == null && valueB == null) return 0;
        if (valueA == null) return 1;
        if (valueB == null) return -1;

        const comparison = typeof valueA === 'number' && typeof valueB === 'number'
          ? valueA - valueB
          : String(valueA).localeCompare(String(valueB));

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return processed;
  }, [data, groupIdentical, sortConfig]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortConfig(prev => ({ ...prev, key: event.target.value }));
  };

  const toggleSortDirection = (): void => {
    setSortConfig(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className={styles.inventoryGrid}>
      <div className={styles.sortControls}>
        <div className={styles.sortSelect}>
          <span className={styles.sortLabel}>Sort by:</span>
          <select
            className={styles.select}
            value={sortConfig.key}
            onChange={handleSortChange}
          >
            <option value="">None</option>
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {sortConfig.key && (
          <button
            className={styles.directionButton}
            onClick={toggleSortDirection}
            type="button"
            aria-label={`Sort ${sortConfig.direction === 'asc' ? 'descending' : 'ascending'}`}
          >
            <ArrowUpDown />
          </button>
        )}
      </div>

      <div className={styles.inventoryGrid}>
        <div>

        </div>
        <div className={styles.cardContainer}>
          {sortedData.map((item, index) => (
            <div key={item.id || index} className={styles.card}>
              {item.id && <div className={styles.id}>#{item.id}</div>}
              {groupIdentical && <div className={styles.quantity}>Quantity: {item.quantity || 1}</div>}

              {item.title && (
                <div className={styles.title}>{item.title}</div>
              )}

              {/* Dimensions section */}
              <div className={styles.dimensions}>
                {['width', 'height', 'depth'].map(dim =>
                  item[dim] != null && (
                    <div key={dim} className={styles.dimension}>
                      <span className={styles.dimensionLabel}>
                        {dim[0].toUpperCase()}
                      </span>
                      <span className={styles.dimensionValue}>
                        {renderDimensionValue(item[dim])}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Other metadata */}
              <div className={styles.metadata}>
                {columns
                  .filter(col => !['id', 'title', 'width', 'height', 'depth'].includes(col.key))
                  .map(col => item[col.key] != null && (
                    <Fragment key={col.key}>
                      <div className={styles.label}>{col.label}:</div>
                      <div>{renderMetadataValue(item[col.key])}</div>
                    </Fragment>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryGrid;