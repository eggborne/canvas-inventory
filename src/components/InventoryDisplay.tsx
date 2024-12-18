import { Fragment, useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import styles from './InventoryDisplay.module.css';
import { Column, DatabaseUserData, DataItem, SortConfig, VisionaryUser } from '../types';

interface InventoryDisplayProps {
  user: VisionaryUser;
  currentInventory: DatabaseUserData;
  data: DataItem[];
  columns: Column[];
  openModal: () => void;
}

const defaultFormatters = {
  text: (value: any) => value?.toString() || value,
  number: (value: any) => value?.toString() || value,
  date: (value: any) => new Date(value).toLocaleDateString()
};

const InventoryDisplay = ({ currentInventory, data, columns, openModal }: InventoryDisplayProps) => {
  const [groupIdentical, setGroupIdentical] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
  console.log('showing', currentInventory)

  const visibleColumns = useMemo(() => {
    return groupIdentical ? columns.filter(column => column.key !== 'id') : columns;
  }, [columns, groupIdentical]);

  const hasIdenticalItems = useMemo(() => {
    const itemSet = new Set();
    for (const item of data) {
      const key = Object.entries(item)
        .filter(([k]) => k !== 'id')
        .map(([_, v]) => JSON.stringify(v))
        .join('|');

      if (itemSet.has(key)) {
        return true;
      }
      itemSet.add(key);
    }
    setGroupIdentical(false);
    return false;
  }, [data]);

  const sortData = (items: DataItem[], config: SortConfig) => {
    return [...items].sort((a, b) => {
      let valueA = a[config.key];
      let valueB = b[config.key];

      const comparison = typeof valueA === 'number' && typeof valueB === 'number'
        ? valueA - valueB
        : String(valueA).localeCompare(String(valueB));

      return config.direction === 'asc' ? comparison : -comparison;
    });
  };

  const processedData = useMemo(() => {
    let processed = [...data];

    if (groupIdentical) {
      const groups = data.reduce<Record<string, DataItem & { quantity: number }>>((acc, item) => {
        // Create a unique key from all values except ID
        const key = Object.entries(item)
          .filter(([k]) => k !== 'id')
          .map(([_, v]) => v)
          .join('-');

        if (!acc[key]) {
          acc[key] = { ...item, quantity: 1 };
        } else {
          acc[key].quantity++;
        }
        return acc;
      }, {});
      processed = Object.values(groups);
    }

    return sortConfig.key ? sortData(processed, sortConfig) : processed;
  }, [data, groupIdentical, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className={styles.sortIcon} />;
    }
    return sortConfig.direction === 'asc'
      ? <ArrowUp className={`${styles.sortIcon} ${styles.active}`} />
      : <ArrowDown className={`${styles.sortIcon} ${styles.active}`} />;
  };

  const labelOptions: Record<string, { short: string, long: string }> = {
    id: {
      short: 'ID',
      long: 'Item ID'
    },
    width: {
      short: 'W',
      long: 'Width'
    },
    height: {
      short: 'H',
      long: 'Height'
    },
    depth: {
      short: 'D',
      long: 'Depth'
    }
  };

  const columnFilters: Record<any, any> = {
    id: {
      prepend: '#',
    },
    width: {
      append: '"',
    },
    height: {
      append: `"`,
    },
    depth: {
      append: `"`,
    },
    price: {
      prepend: '$',
    },
    wired: {
      replace: {
        0: 'No',
        1: 'Yes',
      }
    },
    signed: {
      replace: {
        0: 'No',
        1: 'Yes',
      }
    },
    wrapped: {
      replace: {
        0: 'No',
        1: 'Yes',
      }
    }
  };

  const processItem = (item: DataItem) => {
    const processedItem = { ...item };
    for (const key in columnFilters) {
      if (processedItem[key] !== null && processedItem[key] !== undefined) {
        if (columnFilters[key].prepend) {
          processedItem[key] = columnFilters[key].prepend + processedItem[key];
        }
        if (columnFilters[key].append) {
          processedItem[key] = processedItem[key] + columnFilters[key].append;
        }
        if (columnFilters[key].replace) {
          processedItem[key] = columnFilters[key].replace[processedItem[key]];
        }        
      }
    }
    return processedItem;
  }

  const renderCell = (item: DataItem, column: Column) => {
    const formatter = column.format || defaultFormatters[column.type] || undefined;
    let cellContent = formatter ? formatter(item[column.key]) : item[column.key];
    cellContent = processItem(item)[column.key];
    return cellContent;
  };

  return (
    <div className={styles.container}>
      {/* {currentInventory.databaseMetadata.displayName} */}
      <button type='button' className='add-button' onClick={openModal}>
        Add new
      </button>

      <div className={styles.controls}>
        {hasIdenticalItems && ( // Conditionally render the toggle
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={groupIdentical}
              onChange={(e) => setGroupIdentical(e.target.checked)}
              className={styles.toggleInput}
            />
            Group identical items
          </label>
        )}
      </div>

      {/* Mobile view */}
      <div className={styles.mobileView}>
        {processedData.map((item, index) => (
          <div key={item.id || index} className={styles.card}>
            <div className={styles.cardGrid}>
              {groupIdentical && (
                <>
                  <div className={styles.label}>Quantity:</div>
                  <div>{item.quantity || 1}</div>
                </>
              )}
              {visibleColumns.map(column => (
                <Fragment key={column.key}>
                  <div className={styles.label}>{column.label}:</div>
                  <div>{renderCell(item, column)}</div>
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className={styles.desktopView}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              {groupIdentical && (
                <th onClick={() => handleSort('quantity')}>
                  <div className={styles.headerContent}>
                    Qty <SortIcon columnKey="quantity" />
                  </div>
                </th>
              )}
              {visibleColumns.map(column => (
                <th key={column.key} onClick={() => handleSort(column.key)}>
                  <div className={styles.headerContent}>
                    {(labelOptions[column.key] && labelOptions[column.key].short) || column.label} <SortIcon columnKey={column.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.map((item, index) => (
              <tr key={item.id || index}>
                {groupIdentical && <td>{item.quantity || 1}</td>}
                {visibleColumns.map(column => (
                  <td key={column.key}>{renderCell(item, column)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryDisplay;