import React, { useEffect, useState } from "react";
import CollapsibleContainer from "../CollapsibleBanner";
import { toastWarning } from "@util/toaster";

const ProductSpecTab = ({ specs = [], onChange }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempSpec, setTempSpec] = useState({ spec_name: "", detail: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (index, spec) => {
    setEditingIndex(index);
    setTempSpec(spec);
  };

  const handleDelete = (index) => {

    onChange(specs.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if(!tempSpec.spec_name || !tempSpec.detail) {
      toastWarning("Please fill in all fields");
      return;
    }
    let newSpecs = [...specs];

    if (editingIndex !== null) {
      newSpecs[editingIndex] = tempSpec;
      setEditingIndex(null);
    } else {
      newSpecs.push(tempSpec);
      setIsAdding(false);
    }
    onChange(newSpecs);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setTempSpec({ spec_name: "", detail: "" });
  };

  useEffect(() => {
    if (isAdding) {
      handleCancel();
    }
  }, [isAdding]);

  return (
    <div className="panel-2 w-full md:max-w-[350px] h-fit">
      <div className="bg-primary-variant rounded-md text-on-primary md:text-xl font-bold text-center p-2">
        Product specs
      </div>
      <CollapsibleContainer
        maxHeight={400}
        content={
          <div className="flex flex-col gap-2 py-2">
            <ul className="flex flex-col gap-2">
              {specs.map((item, index) => (
                <li
                  key={index}
                  className="grid grid-cols-[30%_1fr_auto] gap-2 items-start odd:bg-surface odd:text-on-surface rounded-lg p-2"
                >
                  {editingIndex === index ? (
                    <>
                      <input
                        className="text-sm px-2 py-1 rounded border bg-transparent text-inherit"
                        value={tempSpec.spec_name}
                        onChange={(e) =>
                          setTempSpec({
                            ...tempSpec,
                            spec_name: e.target.value,
                          })
                        }
                      />
                      <textarea
                        className="text-sm px-2 py-1 rounded border resize-none bg-transparent text-inherit"
                        value={tempSpec.detail}
                        onChange={(e) =>
                          setTempSpec({ ...tempSpec, detail: e.target.value })
                        }
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={handleSave}
                          className="rounded text-white p-1 bg-green-600 font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="rounded text-white p-1 bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold">{item.spec_name}</div>
                      <div className="whitespace-pre-line">{item.detail}</div>
                      <div className="flex flex-col gap-1 text-sm">
                        <button
                          onClick={() => handleEdit(index, item)}
                          className="rounded text-white p-1 bg-blue-600 font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="rounded text-white p-1 bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
            {isAdding && (
              <div
                className={`grid grid-cols-[30%_1fr_auto] gap-2 items-start ${
                  specs.length % 2 === 0 && "bg-surface text-on-surface"
                }}  rounded-lg p-2`}
              >
                <input
                  className="text-sm px-2 py-1 rounded border bg-transparent text-inherit"
                  value={tempSpec.spec_name}
                  onChange={(e) =>
                    setTempSpec({ ...tempSpec, spec_name: e.target.value })
                  }
                />
                <textarea
                  className="text-sm px-2 py-1 rounded border resize-none bg-transparent text-inherit"
                  value={tempSpec.detail}
                  onChange={(e) =>
                    setTempSpec({ ...tempSpec, detail: e.target.value })
                  }
                />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={handleSave}
                    className="rounded text-white p-1 bg-green-600 font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="rounded text-white p-1 bg-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsAdding((prev) => !prev)}
              className="rounded w-full bg-on-primary px-3 py-1 text-primary font-bold self-center hover:bg-on-primary/80"
            >
              + Add Spec
            </button>
          </div>
        }
      />
    </div>
  );
};

export default ProductSpecTab;
