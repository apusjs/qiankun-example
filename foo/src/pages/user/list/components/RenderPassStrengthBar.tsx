import React from 'react';
import styles from './RenderPassStrengthBar.less';

function cx(classNames: any) {
  if (typeof classNames === 'object') {
    return Object.keys(classNames).filter(function (className) {
      return classNames[className];
    }).join(' ');
  }
  // eslint-disable-next-line prefer-rest-params
  return Array.prototype.join.call(arguments, ' ');

}

const RenderPassStrengthBar: React.FC<any> = (props) => {


  const strength = props.security // type === 'pass' ? this.state.passStrength : this.state.rePassStrength;
  const classSet = cx({
    'ant-pwd-strength': true,
    'ant-pwd-strength-low': strength === 2,
    'ant-pwd-strength-medium': strength === 3,
    'ant-pwd-strength-high': strength > 3
  });
  const level = {
    0: '差',
    1: '差',
    2: '低',
    3: '中',
    4: '高',
    5: '高'
  };

  return (
    <div className={styles.pwd}>
      <div className={classSet}>
        <span className="ant-pwd-strength-item ant-pwd-strength-item-1"/>
        <span className="ant-pwd-strength-item ant-pwd-strength-item-2"/>
        <span className="ant-pwd-strength-item ant-pwd-strength-item-3"/>
        <span className="ant-form-text">
            {level[strength]}
          </span>
      </div>
    </div>
  );

};

export default RenderPassStrengthBar;
