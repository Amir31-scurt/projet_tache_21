import React, { useContext } from "react";
import NavBarContext from "./context";
import { Input, InputGroup } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import { MdAlternateEmail, MdOutlinePassword } from "react-icons/md";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";

const FormComponent = ({
  newDisplayName,
  newPassword,
  onDisplayNameChange,
  onPasswordChange,
}) => {
  const { visible, handleChange } = useContext(NavBarContext);

  return (
    <div>
      <InputGroup className="mb-2 order border-3">
        <InputGroup.Addon>
          <AvatarIcon className="IcoColor" />
        </InputGroup.Addon>
        <Input
          type="text"
          className="border border-0"
          placeholder="Changer votre Nom"
          id="displayName"
          value={newDisplayName}
          onChange={onDisplayNameChange}
        />
      </InputGroup>
      <InputGroup className="mb-2 order border-3">
        <InputGroup.Addon>
          <MdOutlinePassword className="IcoColor" />
        </InputGroup.Addon>
        <Input
          className="border border-0"
          type={visible ? "text" : "password"}
          placeholder="Changer mot de passe "
          id="newPassword"
          value={newPassword}
          onChange={onPasswordChange}
        />
        <InputGroup.Button onClick={handleChange && handleChange}>
          {visible ? <EyeIcon /> : <EyeSlashIcon />}
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default FormComponent;
