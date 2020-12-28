import { message, Tree, Row, Col, Form, TreeSelect, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Menu } from './data.d';
import { addMenu, removeMenu, updateMenu, queryMenus } from './service';
import TreeDeepSearch from "@/utils/TreeDeepSearch";
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');
  try {
    await addMenu({ ...fields });
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
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (e, fields) => {
  e.stopPropagation();
  const hide = message.loading('正在删除');
  if (!fields) return true;
  try {
    await removeMenu({
      id: fields.key,
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

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');
  try {
    await updateMenu(fields);
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

function sortNodesAndChildren(nodes) {
  const arr = []
  nodes.forEach((node) => {
    let temp: any = {
      title: node.name,
      key: node.id,
      value: node.id,
      children: undefined
    }
    if (node.children?.length > 0) {
      temp.children = sortNodesAndChildren(node.children);
    }
    arr.push(temp)
  })
  return arr
}

const formatData = (data) =>  {
  return sortNodesAndChildren(data)
}

const searchData = (data, key) =>  {
  const path = TreeDeepSearch({root: data, key: 'id', children: 'children', name: key})
  const that = path[0]
  if (path.length > 1) {
    that.parent = path[1]
  }else {
    that.parent = {name: ''}
  }
  return that
}

const MenuList: React.FC<{}> = () => {
  const [loading, setLoading ] = useState<boolean>(false);
  const [menuData, setMenuData] = useState<any>([]);
  const [treeData, setTreeData] = useState<any>([]);
  const [activeNode, setActiveNode] = useState<any>({});
  const [activeNodeParentId, setActiveNodeParentId] = useState<any>(undefined);
  const [expandedKeys, setExpandedKeys] = useState<any>([]);

  const [form] = Form.useForm();

  const fetchData = async () => {
    const [err, data ] = await queryMenus().then(data => [null, data] ).catch(err => [err, null]);
    if (err) {
      return
    }
    setMenuData(data)
    setExpandedKeys(data.map(e => e.id))
    setTreeData(formatData(data))
  }

  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(activeNode)
    setActiveNodeParentId(activeNode?.parent?.id)
  }, [activeNode]);

  const onDragEnter = info => {
    // console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  const onDrop = async info => {
    // console.log(info);
    if (loading) {
      return
    }
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...treeData];
    let getParentId = (ar: any, length: number) => {
      const path = TreeDeepSearch({root:data, key: 'key', children: 'children', name: ar?.key || dropKey})
      const index = path.length > length ? 1 : 0
      if(dragKey === path[index].key) {
        return null
      }
      return path[index].key
    }

    // Find dragObject
    let dragObj;
    let newMenu = {}
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
        newMenu = {id: dragKey, parentId: dropKey,  sort: item.children.length}
        // console.log(1, newMenu)
      });
    } else if (
      (info.node.children || []).length > 0 && // Has children
      info.node.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        newMenu = {id: dragKey, parentId: getParentId(dropKey, 2), sort: 1}
        // console.log(2, newMenu)
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
        newMenu = {id: dragKey, parentId: getParentId(ar[i], 1), sort: i + 1}
        // console.log(3, newMenu)
      } else {
        ar.splice(i + 1, 0, dragObj);
        newMenu = { id: dragKey, parentId: getParentId(ar[i + 1], 1), sort: i + 2}
        // console.log(4, newMenu)
      }
    }
    setTreeData(data)
    setLoading(true)
    await handleUpdate(newMenu)
    await fetchData()
    setLoading(false)
  };

  const onAdd = (e,info) => {
    if (!e && !info) {
      setActiveNode({})
      return
    }
    e.stopPropagation();
    const {children, ...that} = searchData(menuData, info.key)
    setActiveNode({
      parent: that
    })
  };

  const onRemove = async (e,nodeData) => {
    e.stopPropagation();
    await handleRemove(e,nodeData)
    await fetchData()
  };

  const onSelect = (_, { node }) => {
    setActiveNode(searchData(menuData, node.key))
  };

  const onTreeChange = (e) => {
    setActiveNodeParentId(e || null)
  };

  const titleRender = (nodeData) => {
    return (<div>
      {nodeData.title}
      <span onClick={e => onAdd(e,nodeData)}><PlusOutlined /></span>
      <span onClick={e => onRemove(e,nodeData)}><DeleteOutlined /></span>
    </div>)
  }

  return (
    <PageContainer>
      <Row>
        <Col span={6}>
          <Button onClick={() => {onAdd()}}>新增</Button>
          {treeData?.length > 0 ?
          <Tree
          className="draggable-tree"
          defaultExpandAll
          draggable
          blockNode
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          onSelect={onSelect}
          titleRender={titleRender}
          treeData={treeData}
        />: null}
        </Col>
        <Col span={16}>
          <ProForm
            form={form}
            onFinish={async () => {
              const {parent, ...values} = form.getFieldsValue()
              const data = {
                ...values,
                role: Number(values.role),
                sort: Number(values.sort),
                id: activeNode.id,
                parentId: activeNodeParentId
              }
              if (data.id) {
                await handleUpdate(data);
              } else {
                await handleAdd(data);
              }
              await fetchData()
            }}
          >
            <ProFormText width="s" name="name" label="名称" />
            <ProFormText width="s" name="path" label="路径" />
            <ProFormText width="s" name="icon" label="图标" />
            <ProFormText width="s" name="sort" label="排序" />
            <ProFormSelect  width="s" name="role" label="权限"
                            options={[
                              {
                                value: 1,
                                label: '管理员',
                              },
                              {
                                value: 3,
                                label: '浏览者',
                              },
                            ]}
            />
            <div>
              父级
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
                treeData={treeData}
                value={activeNodeParentId}
                onChange={onTreeChange}
              />
            </div>

          </ProForm>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default MenuList;
