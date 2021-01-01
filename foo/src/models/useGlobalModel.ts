import { useState, useCallback } from 'react'
import { useModel } from 'umi';

export default function useGlobalModel() {

  const spaGlobalState = useModel('@@qiankunStateFromMaster');

  if (spaGlobalState) {
    return {
      globalModel: spaGlobalState.spaGlobalState,
      setGlobalModel: spaGlobalState.setSpaGlobalState
    }
  }


  const [globalModel, setGlobalModel] = useState({})

  const update = useCallback((data) => {
    setGlobalModel(data);
  }, [])



  return {
    globalModel,
    setGlobalModel: update
  }
}
