// Wraps children in a HUD-style corner frame.
export default function Frame({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`frame ${className}`} {...rest}>
      <span className="frame__c frame__c--tl" />
      <span className="frame__c frame__c--tr" />
      <span className="frame__c frame__c--bl" />
      <span className="frame__c frame__c--br" />
      {children}
    </Tag>
  );
}
