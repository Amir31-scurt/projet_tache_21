import {
  Table,
  Popover,
  Whisper,
  Checkbox,
  Dropdown,
  IconButton,
  Progress,
} from 'rsuite';
import MoreIcon from '@rsuite/icons/legacy/More';
import { mockUsers } from './Mock';
import { useState } from 'react';

const { Column, HeaderCell, Cell } = Table;
const data = mockUsers(8);

const NameCell = ({ rowData, dataKey, ...props }) => {
  const speaker = (
    <Popover title="Description">
      <p>
        <b>Name:</b> {rowData.name}
      </p>
      <p>
        <b>Gender:</b> {rowData.gender}
      </p>
      <p>
        <b>City:</b> {rowData.city}
      </p>
      <p>
        <b>Street:</b> {rowData.street}
      </p>
    </Popover>
  );

  return (
    <Cell {...props}>
      <Whisper placement="top" speaker={speaker}>
        <a href="#Home">{rowData[dataKey]}</a>
      </Whisper>
    </Cell>
  );
};

const ImageCell = ({ rowData, dataKey, ...props }) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div
      style={{
        width: 40,
        height: 40,
        background: '#f5f5f5',
        borderRadius: 6,
        marginTop: 2,
        overflow: 'hidden',
        display: 'inline-block',
      }}
    >
      <img src={rowData.avatar} alt="" width="40" />
    </div>
  </Cell>
);

const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div style={{ lineHeight: '46px' }}>
      <Checkbox
        value={rowData[dataKey]}
        inline
        onChange={onChange}
        checked={checkedKeys.some((item) => item === rowData[dataKey])}
      />
    </div>
  </Cell>
);

const renderMenu = ({ onClose, left, top, className }, ref) => {
  const handleSelect = (eventKey) => {
    onClose();
    console.log(eventKey);
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item eventKey={4}>View Profile</Dropdown.Item>
        <Dropdown.Item eventKey={5}>Block</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};

const ActionCell = ({ rowData, dataKey, ...props }) => {
  return (
    <Cell {...props} className="link-group">
      <Whisper
        placement="autoVerticalStart"
        trigger="click"
        speaker={renderMenu}
      >
        <IconButton appearance="subtle" icon={<MoreIcon />} />
      </Whisper>
    </Cell>
  );
};

const StudentTable = () => {
  const [checkedKeys, setCheckedKeys] = useState([]);
  let checked = false;
  let indeterminate = false;

  if (checkedKeys.length === data.length) {
    checked = true;
  } else if (checkedKeys.length === 0) {
    checked = false;
  } else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
    indeterminate = true;
  }

  const handleCheckAll = (value, checked) => {
    const keys = checked ? data.map((item) => item.id) : [];
    setCheckedKeys(keys);
  };
  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter((item) => item !== value);
    setCheckedKeys(keys);
  };

  return (
    <div className="mx-5 my-3 w-100">
      <h3>Base de données étudiants</h3>
      <Table height={300} data={data} id="table">
        <Column width={50} align="center">
          <HeaderCell style={{ padding: 0 }}>
            <div style={{ lineHeight: '40px' }}>
              <Checkbox
                inline
                checked={checked}
                indeterminate={indeterminate}
                onChange={handleCheckAll}
              />
            </div>
          </HeaderCell>
        </Column>
        <Column width={80} align="center">
          <HeaderCell>Avatar</HeaderCell>
          <ImageCell dataKey="avatar" />
        </Column>
        <Column width={160}>
          <HeaderCell>Nom</HeaderCell>
          <NameCell dataKey="name" />
        </Column>
        <Column width={230}>
          <HeaderCell>Progression</HeaderCell>
          <Cell style={{ padding: '10px 0' }}>
            {(rowData) => (
              <Progress percent={rowData.progress} showInfo={false} />
            )}
          </Cell>
        </Column>
        <Column width={100}>
          <HeaderCell>Note</HeaderCell>
          <Cell>
            {(rowData) =>
              Array.from({ length: rowData.rating }).map((_, i) => (
                <span key={i}>⭐️</span>
              ))
            }
          </Cell>
        </Column>
        <Column width={100}>
          <HeaderCell>Solde</HeaderCell>
          <Cell>{(rowData) => `$${rowData.amount}`}</Cell>
        </Column>
        <Column width={120}>
          <HeaderCell>
            <MoreIcon />
          </HeaderCell>
          <ActionCell dataKey="id" />
        </Column>
      </Table>
    </div>
  );
};

export default StudentTable;
