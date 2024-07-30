// src/components/ExpensesTable.jsx
import React from 'react';
import { useTable } from 'react-table';
import '../styles/expenses.css';

const ExpensesTable = () => {
  const data = React.useMemo(
    () => [
      { date: '2024-07-28', category: 'Groceries', amount: '$150' },
      { date: '2024-07-29', category: 'Utilities', amount: '$75' },
      { date: '2024-07-30', category: 'Entertainment', amount: '$120' },
      // Add more rows as needed
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      { Header: 'Date', accessor: 'date' },
      { Header: 'Category', accessor: 'category' },
      { Header: 'Amount', accessor: 'amount' },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: () => <button className="btn">Edit</button>,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} className="expenses-table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
        );
        })}
      </tbody>
    </table>
  );
};

export default ExpensesTable;
