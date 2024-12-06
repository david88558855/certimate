import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Modal, notification, Space, Table, Tooltip, Typography, type TableProps } from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { Copy as CopyIcon, Pencil as PencilIcon, Plus as PlusIcon, Trash2 as Trash2Icon } from "lucide-react";
import moment from "moment";

import AccessEditDialog from "@/components/certimate/AccessEditDialog";
import { Access as AccessType, accessProvidersMap } from "@/domain/access";
import { remove as removeAccess } from "@/repository/access";
import { useConfigContext } from "@/providers/config";

const AccessList = () => {
  const { t } = useTranslation();

  const [modalApi, ModelContextHolder] = Modal.useModal();
  const [notificationApi, NotificationContextHolder] = notification.useNotification();

  const [loading, setLoading] = useState<boolean>(false);

  const tableColumns: TableProps<AccessType>["columns"] = [
    {
      key: "$index",
      align: "center",
      title: "",
      width: 50,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "name",
      title: t("common.text.name"),
      ellipsis: true,
      render: (_, record) => <>{record.name}</>,
    },
    {
      key: "provider",
      title: t("common.text.provider"),
      render: (_, record) => {
        return (
          <Space className="max-w-full" size={4}>
            <Avatar src={accessProvidersMap.get(record.configType)?.icon} size="small" />
            <Typography.Text>{t(accessProvidersMap.get(record.configType)?.name ?? "")}</Typography.Text>
          </Space>
        );
      },
    },
    {
      key: "createdAt",
      title: t("common.text.created_at"),
      ellipsis: true,
      render: (_, record) => {
        return moment(record.created!).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      key: "updatedAt",
      title: t("common.text.updated_at"),
      ellipsis: true,
      render: (_, record) => {
        return moment(record.updated!).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      key: "$action",
      align: "end",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <>
          <Space size={0}>
            <AccessEditDialog
              trigger={
                <Tooltip title={t("access.action.edit")}>
                  <Button type="link" icon={<PencilIcon size={16} />} />
                </Tooltip>
              }
              op="edit"
              data={record}
            />

            <AccessEditDialog
              trigger={
                <Tooltip title={t("access.action.copy")}>
                  <Button type="link" icon={<CopyIcon size={16} />} />
                </Tooltip>
              }
              op="copy"
              data={record}
            />

            <Tooltip title={t("access.action.delete")}>
              <Button
                type="link"
                danger={true}
                icon={<Trash2Icon size={16} />}
                onClick={() => {
                  handleDeleteClick(record);
                }}
              />
            </Tooltip>
          </Space>
        </>
      ),
    },
  ];
  const [tableData, setTableData] = useState<AccessType[]>([]);
  const [tableTotal, setTableTotal] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const configContext = useConfigContext();

  const fetchTableData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const items = configContext.config.accesses.slice(startIndex, endIndex);

      setTableData(items);
      setTableTotal(configContext.config.accesses.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [page, pageSize, configContext.config.accesses]);

  const handleDeleteClick = async (data: AccessType) => {
    modalApi.confirm({
      title: t("access.action.delete"),
      content: t("access.action.delete.confirm"),
      onOk: async () => {
        // TODO: 有关联数据的不允许被删除
        try {
          const res = await removeAccess(data);
          configContext.deleteAccess(res.id);
        } catch (err) {
          notificationApi.error({ message: t("common.text.request_error"), description: <>{String(err)}</> });
        }
      },
    });
  };

  // TODO: Empty 样式
  // TODO: 响应式表格

  return (
    <>
      {ModelContextHolder}
      {NotificationContextHolder}

      <PageHeader
        title={t("access.page.title")}
        extra={[
          <AccessEditDialog
            key="create"
            trigger={
              <Button key="create" type="primary" icon={<PlusIcon size={16} />}>
                {t("access.action.add")}
              </Button>
            }
            op="add"
          />,
        ]}
      />

      <Table<AccessType>
        columns={tableColumns}
        dataSource={tableData}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: tableTotal,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
          onShowSizeChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        rowKey={(record) => record.id}
      />
    </>
  );
};

export default AccessList;
