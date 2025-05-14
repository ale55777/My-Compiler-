import React, { useState } from "react";
import firstFollow from "firstfollow";
import { Button, Table, TableColumnsType } from "antd";

import ComponentAli from "../Components/Component";
import "./Home.css";

interface ProductionRules {
  [key: string]: string[];
}

interface FollowFirstTableRow {
  nonTerminal: string;
  firstSet: string;
  followSet: string;
  [key: string]: string;
}

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState<TableColumnsType<FollowFirstTableRow>>();
  const [data, setData] = useState<FollowFirstTableRow[]>([]);

  const generateFirstFollowTable = (
    terminalProdRules: ProductionRules,
    combinedGrammar: string
  ) => {
    const { firstSet, followSet } = firstFollow(combinedGrammar);
    const nonTerminals = Object.keys(followSet);
    const firstKeys = Object.keys(firstSet);
    const terminals: string[] = [];

    firstKeys.forEach(symbol => {
      if (!nonTerminals.includes(symbol)) terminals.push(symbol);
    });

    nonTerminals.forEach(nt => {
      const followObj = followSet[nt];
      for (const key in followObj) {
        followObj[key] = `${nt} → ε`;
        followObj["$"] = `${nt} → ε`;
      }
      followSet[nt] = followObj;
    });

    const newData: FollowFirstTableRow[] = [];

    nonTerminals.forEach(nt => {
      const nonTerminalFirstSet = Object.keys(firstSet[nt]);
      const nonTerminalFollowSet = Object.keys(followSet[nt]);

      const createTableFirstSet = nonTerminalFirstSet
        .map(symbol => (symbol === "" ? "ε" : symbol))
        .join(",");

      const createTableFollowSet = nonTerminalFollowSet.join(",");

      const epsilonFound = nonTerminalFirstSet.includes("");

      let filledColumns: FollowFirstTableRow = {
        nonTerminal: nt,
        firstSet: `{${createTableFirstSet}}`,
        followSet: `{${createTableFollowSet}}`,
      };

      if (epsilonFound) {
        filledColumns = { ...filledColumns, ...followSet[nt] };
      }

      const concatRule = terminalProdRules[nt].reduce((acc, rule) => acc + rule, "");
      nonTerminalFirstSet.forEach(key => {
        filledColumns[key === "" ? "ε" : key] = `${nt} → ${concatRule}`;
      });

      newData.push(filledColumns);
    });

    setData(newData);

    const columnTerminals = terminals.map(terminal => ({
      title: (
        <span style={{ fontWeight: "bold", fontSize: "15px", color: "#e53935" }}>
          {terminal}
        </span>
      ),
      dataIndex: terminal,
      key: terminal,
    }));

    const tableColumns: TableColumnsType<FollowFirstTableRow> = [
      {
        title: <span style={{ fontWeight: "bold", fontSize: "16px" }}>🎯 Non-Terminal</span>,
        dataIndex: "nonTerminal",
        key: "nonTerminal",
      },
      {
        title: <span style={{ fontWeight: "bold", fontSize: "16px" }}>🅕 First Set</span>,
        dataIndex: "firstSet",
        key: "firstSet",
      },
      {
        title: <span style={{ fontWeight: "bold", fontSize: "16px" }}>📍 Follow Set</span>,
        dataIndex: "followSet",
        key: "followSet",
      },
      ...columnTerminals,
      {
        title: (
          <span style={{ fontWeight: "bold", fontSize: "15px", color: "#e53935" }}>$</span>
        ),
        dataIndex: "$",
        key: "$",
      },
    ];

    setColumns(tableColumns);
  };

  return (
    <div className="home-container">
      <div className="overlay">
        <div className="content">
          <h1 className="title">LL(1) Parser</h1>
          <p className="author">Ali Raza Khan</p>

          {data.length === 0 ? (
            <div className="centered">
              <p className="text-lg mb-4">Click to Place Grammar on Button Below.</p>
              <Button type="primary" onClick={() => setIsModalOpen(true)} className="add-btn">
                Place Grammar
              </Button>
            </div>
          ) : (
            <>
              <div className="btn-wrapper">
                <Button type="primary" onClick={() => setIsModalOpen(true)} className="add-btn">
                  Add Grammar
                </Button>
              </div>

              <Table
                columns={columns}
                dataSource={data}
                rowKey="nonTerminal"
                pagination={false}
                locale={{ emptyText: "" }}
                className="custom-table"
              />
            </>
          )}
        </div>
      </div>

      <ComponentAli
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        generateFirstFollowTable={generateFirstFollowTable}
        setData={setData}
      />
    </div>
  );
};

export default Home;
