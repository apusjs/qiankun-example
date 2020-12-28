import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from 'antd';
import { useModel } from 'umi';


const Welcome: React.FC<{}> = () => {
  const { globalModel, setGlobalModel } = useModel('useGlobalModel');
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    setUser(globalModel)
  }, [globalModel]);

  const inputName = (e:any) =>{
    setUser({...user, name: e.target.value})
  }

  const inputPassword = (e:any) =>{
    setUser({...user, password: e.target.value})
  }

  const updateGlobalState = () =>{
    setGlobalModel(user)
  }

  return (<div>
    <Card>
      globalModel数据:{JSON.stringify(globalModel)}
      <Input value={user.name} onChange={inputName}/>
      <Input value={user.password} onChange={inputPassword}/>
      <Button onClick={updateGlobalState}>更新</Button>
    </Card>
  </div>)
};

export default Welcome
