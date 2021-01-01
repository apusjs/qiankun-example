import React, { useState } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { FormValueType } from "@/pages/user/list/components/UpdateForm";
import styles from "@/pages/user/list/components/UpdateForm.less";
import { CheckPasswordSecurity } from "@/utils/password";
import RenderPassStrengthBar from "@/pages/user/list/components/RenderPassStrengthBar";
import AreaSelect from "@/components/AreaSelect";

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: FormValueType) => void;
}

const FormItem = Form.Item;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {
    onSubmit,
    onCancel: handleModalVisible,
    modalVisible,
  } = props;

  const [passwordSecurity, setPasswordSecurity] = useState<number | undefined>(undefined);

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const { password2, ...fieldsValue } = { ...await form.validateFields() };
    onSubmit(fieldsValue)
  }

  const validPassword = (rule, value): Promise<any> => {
    const password = value
    const password2 = form.getFieldValue('password2')
    if (password && password2 && password2 === password) {
      return Promise.resolve();
    }
    if (!password && !password2) {
      return Promise.resolve();
    }

    if (!password && password2) {
      return Promise.reject(new Error('密码不能为空'));
    }
    if (password && !password2) {
      return Promise.reject();
    }

    return Promise.reject(new Error('请输入密码！'));

  }

  const validPassword2 = (rule, value): Promise<any> => {
    const password = form.getFieldValue('password')
    const password2 = value
    if (password && password2 && password2 === password) {
      return Promise.resolve();
    }
    if (!password && !password2) {
      return Promise.resolve();
    }

    if (password && !password2) {
      return Promise.reject(new Error('确认密码不能为空'));
    }

    if (password !== password2) {
      return Promise.reject(new Error('两次输入密码不一致！'));
    }
    return Promise.reject(new Error('请输入密码！'));

  }

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="userName"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名！' }]}
        >
          <Input/>
        </FormItem>
        <FormItem
          name="nick"
          label="用户昵称"
          rules={[{ required: true, message: '请输入用户昵称！' }]}
        >
          <Input/>
        </FormItem>
        <FormItem
          name="password"
          label="密码"
          rules={[{
            validator: validPassword
          }]}
        >
          <div className={styles.pwd}>
            <Input
              type="password"
              onChange={(e) => {
                setPasswordSecurity(e.target.value ? CheckPasswordSecurity(e.target.value) : undefined)
              }}/>
            {passwordSecurity !== undefined ?
              <div className={styles.pwd__strength}><RenderPassStrengthBar security={passwordSecurity}/></div> : null}
          </div>
        </FormItem>
        <FormItem
          name="password2"
          label="确认密码"
          rules={[{
            validator: validPassword2,

          }]}
          validateTrigger="onBlur"
        >
          <Input
            type="password"/>
        </FormItem>
        <FormItem name="avatar" label="头像">
          <Input/>
        </FormItem>
        <FormItem name="status" label="状态"
                  rules={[{ required: true, message: '请选择状态！' }]}
        >
          <Select style={{ width: '100%' }}>
            <Option value={0}>删除</Option>
            <Option value={1}>正确</Option>
            <Option value={2}>异常</Option>
          </Select>
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleModalVisible()}>取消</Button>
        <Button type="primary" onClick={() => handleSubmit()}>
          保存
        </Button>
      </>
    );
  };

  return (
    <Modal
      destroyOnClose
      title="新建用户"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={renderFooter()}
    >
      <Form
        {...formLayout}
        form={form}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default CreateForm;
