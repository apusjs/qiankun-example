import React, { useEffect, useState } from 'react';
import { MicroApp, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Input, Button, Row, Col } from 'antd';
import styles from './Welcome.less';


const Welcome: React.FC<{}> = () => {
  const { spaGlobalState, setSpaGlobalState } = useModel('@@qiankunStateForSlave');
  const [userStart, setUserStart] = useState<any>(spaGlobalState);

  useEffect(() => {
    setUserStart(spaGlobalState)
  }, [spaGlobalState]);

  const inputName = (e:any) =>{
    setUserStart({...userStart, name: e.target.value})
  }

  const inputPassword = (e:any) =>{
    setUserStart({...userStart, password: e.target.value})
  }

  const updateGlobalState = () =>{
    setSpaGlobalState(userStart)
  }

  return (<PageContainer>
    <Card>
      spaGlobalState数据:{JSON.stringify(spaGlobalState)}
      <Input value={userStart.name} onChange={inputName}/>
      <Input value={userStart.password} onChange={inputPassword}/>
      <Button onClick={updateGlobalState}>更新</Button>
    </Card>
    <Row>
      <Col span={12}>
        <Card>
          <MicroApp name="baz" />
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <MicroApp name="qux" />
        </Card>
      </Col>
    </Row>
  </PageContainer>)
};

export default Welcome
