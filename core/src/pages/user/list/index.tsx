import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, message, Avatar, Table } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule } from './service';
import CreateForm from './components/CreateForm';

/**
 * 添加数据
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新数据
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule(fields);
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除数据
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      render: (dom) => {
        return (
          <Avatar size="large" src={`${dom}`} icon={<UserOutlined/>}/>
        )
      },
    },
    {
      title: '昵称',
      dataIndex: 'nick',
      sorter: true,
      order: 3,
    },

    {
      title: '用户名',
      dataIndex: 'detail',
      sorter: true,
      hideInForm: true,
      renderText: (val: any) => val.userName,
    },
    {
      title: '手机',
      dataIndex: ['detail', 'phone'],
      sorter: true,
      hideInForm: true,
      renderText: (val: any) => val,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      order: 2,
      hideInForm: true,
      copyable: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      order: 1,
      hideInForm: true,
      ellipsis: true,
      valueEnum: {
        0: { text: '删除', status: 'Default' },
        1: { text: '正常', status: 'Success' },
        2: { text: '异常', status: 'Error' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical"/>
          <a href="">删除</a>
        </>
      ),
    },
  ];

  const getList = async (params, sorter, filter) => {
    const [err, data ] = await queryRule({ ...params, sorter, filter }).then(data => [null, data] ).catch(err => [err, null]);
    if (!err) {
      return {
        ...data,
        data: data.data.map((v) => {
          let temp = v
          temp.address.map((e) => {
            e.area = [e.provinceCode, e.cityCode, e.areaCode]
            return e
          })
          return temp
        })
      }
    }
  }

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="用户列表"
        actionRef={actionRef}
        pagination={{
          defaultPageSize: 10
        }}
        tableAlertRender={false}
        rowKey="userId"
        toolBarRender={() => [
          <Button type="primary" onClick={() => {
            handleCreateModalVisible(true);
          }}>
            <PlusOutlined/> 新建
          </Button>,
        ]}
        request={getList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleCreateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleCreateModalVisible(false)}
                  modalVisible={createModalVisible} />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          modalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageContainer>
  );
};

export default TableList;
