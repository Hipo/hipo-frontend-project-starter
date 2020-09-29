import {ReactComponent as HipoLogo} from "../core/ui/icons/hipo-logo.svg";

import "./_home.scss";

import React from "react";
import {useSelector} from "react-redux";

import {authenticationProfileSelector} from "../authentication/redux/util/authenticationReduxUtils";

interface HomeProps {
  name: string;
}

function Home(props: HomeProps) {
  const authProfile = useSelector(authenticationProfileSelector);

  return (
    <>
      <HipoLogo width={"220"} height={"110"} className={"hipo-logo"} />

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
