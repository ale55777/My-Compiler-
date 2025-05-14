import React from "react";
import { Button, Form, Input, Modal } from "antd";

interface GrammarRule {
  rule: string;
}

interface ModalComponentProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  generateFirstFollowTable: (rules: Record<string, string[]>, allRules: string) => void;
  setData: (data: any[]) => void;
}

const ComponentAli: React.FC<ModalComponentProps> = ({
  isModalOpen,
  setIsModalOpen,
  generateFirstFollowTable,
  setData,
}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    form.submit();
    setData([]);
  };

  const handleFinish = (body: { grammar: string }) => {
    const grammarRaw = body.grammar.trim();

    const lines = grammarRaw
      .split(/\n|;/) // supports both line breaks or semicolons
      .map((line) => line.trim())
      .filter(Boolean);

    const combineProdRulesForFirstFollow = lines.join(";");

    const terminalProdRules: Record<string, string[]> = {};
    lines.forEach((rule) => {
      const [lhs, rhs] = rule.split("->");
      if (!lhs || !rhs) return;
      const nonTerminal = lhs.trim();
      const productions = rhs.trim().split("|").map((p) => p.trim());

      terminalProdRules[nonTerminal] = productions;
    });

    generateFirstFollowTable(terminalProdRules, combineProdRulesForFirstFollow);
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Enter Your Grammar"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Parse"
  
    >
      <Form onFinish={handleFinish} form={form}>
        <Form.Item
          name="grammar"
          rules={[{ required: true, message: " WARNING! NO RULES." }]}
        >
          <Input.TextArea
            placeholder={`Example:\nS -> A B\`nA -> a | ε\nB -> b`}
            autoSize={{ minRows: 6 }}
            style={{
              borderRadius: "10px",
              border: "2px solid #e42926",
              fontWeight: "500",
              fontFamily: "monospace",
              padding: "12px",
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ComponentAli;
