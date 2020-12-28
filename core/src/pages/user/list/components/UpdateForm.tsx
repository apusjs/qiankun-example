import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps } from 'antd';
import { TableListItem } from '../data.d';
import styles from './UpdateForm.less';
import { CheckPasswordSecurity } from '@/utils/password';
import RenderPassStrengthBar from './RenderPassStrengthBar';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import AreaSelect from "@/components/AreaSelect";
import { IsPhone } from "@/utils/regexpTest";


export interface FormValueType extends Partial<TableListItem> {
  userId?: string;
  nick?: string | null;
  avatar?: string | null;
  sex?: string | null;
  status?: number;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  modalVisible: boolean;
  values: Partial<TableListItem>;
}

const FormItem = Form.Item;
const FormList = Form.List;
const { Step } = Steps;
const { Option } = Select;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};


const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    oauth: [],
    address: [],
    ...props.values
  });
  const [deleteOauthList, setDeleteOauthList] = useState<[any]>([]);
  const [deleteAddressList, setDeleteAddressList] = useState<[any]>([]);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [passwordSecurity, setPasswordSecurity] = useState<number | undefined>(undefined);

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleModalVisible,
    modalVisible,
    values,
  } = props;

  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async () => {
    const fieldsValue = { ...formVals, ...await form.validateFields() };
    setFormVals(fieldsValue)

    if (currentStep < 3) {
      forward();
    } else {
      // 配置要删除的列表
      const { password2, ...detail } = fieldsValue.detail
      const oauth = [...fieldsValue.oauth]
      deleteOauthList.forEach((v) => {
        if (!fieldsValue.oauth.some((e) => e.oauthType === v.oauthType)) {
          oauth.push({ ...v, del: true })
        }
      })
      const address = [...fieldsValue.address.map(({ area, ...data }) => {
        const [province = {}, city = {}, Area = {}] = area;
        if (province.id) {
          return {
            ...data,
            provinceCode: province.id,
            provinceName: province.fullname,
            cityCode: city.id,
            cityName: city.fullname,
            areaCode: Area.id,
            areaName: Area.fullname,
          }
        }
        return data
      })]
      deleteAddressList.forEach(({ area, ...data }: any) => {
        address.push({ ...data, del: true })
      })
      handleUpdate({ ...fieldsValue, address, oauth, detail });
    }
  };

  const validPassword = (rule, value): Promise<any> => {
    const password = value
    const password2 = form.getFieldValue(['detail', 'password2'])
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
    const password = form.getFieldValue(['detail', 'password'])
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

  const validOauthType = (rule, value): Promise<any> => {
    const oauth = form.getFieldValue('oauth');
    if (!value) {
      return Promise.reject(new Error('请选择受权类型'));
    }
    if (oauth.filter((e) => e?.oauthType === value).length < 2) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('此类型已经被使用'));
  }

  const validPhone = (rule, value): Promise<any> => {
    if (!value) {
      return Promise.reject(new Error('请输入手机号'));
    }
    if (IsPhone(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('手机号格式不正确'));
  }


  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <FormItem
            name={['detail', 'userName']}
            label="用户名"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            {(values?.detail?.userName) ?
              values?.detail?.userName :
              <Input/>
            }
          </FormItem>
          <FormItem
            name={['detail', 'phone']}
            label="手机"
          >
            <Input/>
          </FormItem>
          <FormItem
            name={['detail', 'password']}
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
            name={['detail', 'password2']}
            label="确认密码"
            rules={[{
              validator: validPassword2,

            }]}
            validateTrigger="onBlur"
          >
            <Input
              type="password"/>
          </FormItem>
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <FormList name="oauth">
            {(fields, { add, remove }) => (
              <div className={styles.formList}>
                {fields.map(field => (
                  <div key={field.key} className={styles.formList__item}>
                    <MinusCircleOutlined
                      className={styles.formList__del}
                      onClick={() => {
                        const val = formVals.oauth[field.key];
                        if (val?.__typename) {
                          setDeleteOauthList([...deleteOauthList, val])
                        }
                        remove(field.name);
                      }}
                    />
                    <FormItem label="受权类型" name={[field.name, 'oauthType']}
                              rules={[{
                                validator: validOauthType
                              }]}
                    >
                      <Select style={{ width: '100%' }}>
                        <Option value="mp">微信公众号</Option>
                        <Option value="weApp">微信小程序</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="appId" name={[field.name, 'appId']}
                              rules={[{ required: true }]}
                    >
                      <Input/>
                    </FormItem>
                    <FormItem label="openId" name={[field.name, 'openId']}
                              rules={[{ required: true }]}
                    >
                      <Input/>
                    </FormItem>
                  </div>
                ))}
                {fields.length < 2 ?
                  <div>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      block
                    >
                      <PlusOutlined/> Add field
                    </Button>
                  </div>
                  : null
                }
              </div>
            )}

          </FormList>
        </>
      );
    }
    if (currentStep === 3) {
      return (
        <>
          <FormList name="address">
            {(fields, { add, remove }) => (
              <div className={styles.formList}>
                {fields.map(field => (
                  <div key={field.key} className={styles.formList__item}>
                    <MinusCircleOutlined
                      className={styles.formList__del}
                      onClick={() => {
                        const val = formVals.address[field.key];
                        if (val?.__typename) {
                          setDeleteAddressList([...deleteAddressList, val])
                        }
                        remove(field.name);
                      }}
                    />
                    <FormItem label="收货人" name={[field.name, 'receiverName']}
                              rules={[{ required: true }]}
                    >
                      <Input/>
                    </FormItem>
                    <FormItem label="手机" name={[field.name, 'receiverPhone']}
                              rules={[{
                                validator: validPhone
                              }]}
                    >
                      <Input/>
                    </FormItem>
                    <FormItem label="地区" name={[field.name, 'area']}
                              rules={[{ required: true }]}
                    >
                      <AreaSelect/>
                    </FormItem>

                    <FormItem label="详细地址" name={[field.name, 'address']}
                              rules={[{ required: true }]}
                    >
                      <Input/>
                    </FormItem>
                  </div>
                ))}
                {fields.length < 10 ?
                  <div>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      block
                    >
                      <PlusOutlined/> Add field
                    </Button>
                  </div>
                  : null
                }
              </div>
            )}

          </FormList>
        </>
      );
    }
    return (
      <>
        <FormItem
          name="nick"
          label="用户昵称"
          rules={[{ required: true, message: '请输入用户昵称！' }]}
        >
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
        <FormItem name="avatar" label="头像">
          <Input/>
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    if (currentStep > 0 && currentStep < 3) {
      return (
        <>
          <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={() => handleModalVisible(false, values)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            下一步
          </Button>
        </>
      );
    }
    if (currentStep === 3) {
      return (
        <>
          <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={() => handleModalVisible(false, values)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            完成
          </Button>
        </>
      );
    }
    return (
      <>
        <Button onClick={() => handleModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          下一步
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="用户配置"
      visible={modalVisible}
      footer={renderFooter()}
      onCancel={() => handleModalVisible()}
    >
      <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
        <Step title="基本信息"/>
        <Step title="登陆信息"/>
        <Step title="OAuth信息"/>
        <Step title="地址信息"/>
      </Steps>
      <Form
        {...formLayout}
        form={form}
        initialValues={formVals}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
