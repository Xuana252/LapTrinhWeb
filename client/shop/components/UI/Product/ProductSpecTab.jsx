import React from "react";
import CollapsibleContainer from "../CollapsibleBanner";

const ProductSpecTab = ({ specs }) => {
  return (
    <div className="panel-2 w-full  md:max-w-[350px] h-fit ">
      <div className="bg-primary-variant rounded-md text-on-primary md:text-xl font-bold text-center p-2">
        Product specs
      </div>
      <CollapsibleContainer
        maxHeight={400}
        content={
          <ul className="flex flex-col gap-2 py-2">
            {specs?.map((item,index) => (
              <li
                key={index}
                className="grid-cols-2 break-all grid odd:bg-surface odd:text-on-surface rounded-lg p-2"
              >
                <div>
                  <b>{item.spec_name}</b>
                </div>
                <div>{item.detail}</div>
              </li>
            ))}
          </ul>
        }
      />
    </div>
  );
};

export default ProductSpecTab;
