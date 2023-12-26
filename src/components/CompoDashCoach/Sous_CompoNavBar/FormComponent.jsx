import React, { useContext } from "react";
import NavBarContext from "./context";
import { Input, InputGroup } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import { MdAlternateEmail, MdOutlinePassword } from "react-icons/md";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";

const FormComponent = () => {
  const { visible, handleChange } = useContext(NavBarContext);

  return (
    <div>
      {/*============ Champ Modifier Nom ========= */}
      <InputGroup className="mb-2 order border-3">
        <InputGroup.Addon>
          <AvatarIcon className="IcoColor" />
        </InputGroup.Addon>
        <Input className="border border-0" placeholder="Changer votre Nom" />
      </InputGroup>

      {/*============ Champ Modifier Email ========= */}
      <InputGroup className="mb-2 order border-3">
        <InputGroup.Addon>
          <MdAlternateEmail className="IcoColor" />
        </InputGroup.Addon>
        <Input placeholder="Changer Votre E-mail " />
      </InputGroup>

      {/*============ Champ Modifier Password ========= */}
      <InputGroup className="mb-2 order border-3">
        <InputGroup.Addon>
          <MdOutlinePassword className="IcoColor" />
        </InputGroup.Addon>
        <Input
          className="border border-0"
          type={visible ? "text" : "password"}
          placeholder="Changer mot de passe "
        />
        <InputGroup.Button onClick={handleChange}>
          {visible ? <EyeIcon /> : <EyeSlashIcon />}
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default FormComponent;
