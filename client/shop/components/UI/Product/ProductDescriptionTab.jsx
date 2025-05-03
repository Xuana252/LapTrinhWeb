import React from "react";
import CollapsibleContainer from "../CollapsibleBanner";
import InputArea from "@components/Input/InputArea";

const ProductDescriptionTab = ({ description }) => {
  return (
    <div className="panel-2 w-full h-fit">
      <div className="bg-primary-variant rounded-md text-on-primary md:text-xl font-bold text-center p-2">
        Product details
      </div>

      <CollapsibleContainer
        maxHeight={400}
        content={<InputArea value={description} />}
      />
    </div>
  );
};

export default ProductDescriptionTab;
