import styles from "./DatabaseSelection.module.css";
import { DatabaseUserData } from "../types";
import { ChangeEvent } from "react";

interface DatabaseSelectionProps {
  databases: DatabaseUserData[];
  selectedDatabase: DatabaseUserData | null;
  onDatabaseSelect: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const DatabaseSelection = ({ databases, selectedDatabase, onDatabaseSelect }: DatabaseSelectionProps) => {

  return (
    <div className={styles.databaseSelection}>
      Collection:&nbsp;&nbsp;
      <select value={selectedDatabase ? selectedDatabase.databaseMetadata?.databaseName : ''} onChange={onDatabaseSelect}>
        <option value="" disabled>
          Choose a database
        </option>
        {databases.map((db) => (
          <option key={db.databaseMetadata.databaseName} value={db.databaseMetadata.databaseName}>
            {db.databaseMetadata.displayName}
          </option>
        ))}
      </select>      
    </div>
  );
};

export default DatabaseSelection;
