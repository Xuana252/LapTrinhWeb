import AccountPageNav from "@components/UI/AccountPageNav";
import React, { Children } from "react";

const AccountLayout = ({children}) => {
  return (
    <section className="size-full grid grid-rows-[auto_1fr] md:grid-cols-[auto_1fr] items-start gap-4 p-4 overflow-visible">
        <AccountPageNav/>
        <div className="panel-2">{children}</div>
    </section>
  );
};

export default AccountLayout;
