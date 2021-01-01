import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';
import TreeDeepSearch from '@/utils/TreeDeepSearch';
import localStorage from 'store';

export interface AreaSelectProps {
  onChange?: (values?: any[]) => void;
  value?: any[];
}

const AreaSelect: React.FC<AreaSelectProps> = (props) => {
  const [ options, setOptions ] = useState([]);
  const {
    onChange,
    value,
  } = props;

  useEffect(() => {
    const fetchData = async () => {
      let data = localStorage.get('area');
      console.log(data)
      if (!data) {
        return []
      }

      setOptions(data)
    }
    fetchData()
  }, [options.length]);

  const handleValue = (value) => {
    return value.map((v) => {
      return String(v)
    })
  }

  const handleChange = (value) => {
    const params = {
      root: options,
      key: 'id',
      children: 'children',
      name: value[value.length - 1]
    };
    onChange(TreeDeepSearch(params).reverse())
  }

  return (
    <Cascader options={options} defaultValue={handleValue(value)} onChange={handleChange}
              fieldNames={{ label: 'label', value: 'id', children: 'children' }}/>
  );
};

export default AreaSelect;
