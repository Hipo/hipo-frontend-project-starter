import {ReactComponent as Logo} from "../core/ui/icons/HipoLogo.svg";

import "./_home.scss";

import React from "react";
import {useSelector} from "react-redux";

import {authenticationProfileSelector} from "../authentication/redux/util/authenticationReduxUtils";

export interface HomeOwnProps {
  name: string;
}

type THomeProps = HomeOwnProps;

function Home(props: THomeProps) {
  const authProfile = useSelector(authenticationProfileSelector);

  return (
    <>
      <Logo width={"220"} height={"110"} className={"hipo-logo"} />

      <div className={"home"}>
        <h1>
          {authProfile ? `Hello ${authProfile.first_name}` : `Welcome To TS Project`}
        </h1>

        {`props["name"]: ${props.name}`}
      </div>
    </>
  );
}

export default Home;
