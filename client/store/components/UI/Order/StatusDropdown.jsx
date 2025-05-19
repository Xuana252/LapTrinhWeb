"use client";
import { Listbox } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faSpinner,
  faTruck,
  faBoxOpen,
  faTimesCircle,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

const statuses = [
  {
    label: "Pending",
    value: "pending",
    icon: faClock,
    color: "text-yellow-500 bg-yellow-100",
  },
  {
    label: "Processing",
    value: "processing",
    icon: faSpinner,
    color: "text-blue-500 bg-blue-100",
  },
  {
    label: "Shipped",
    value: "shipped",
    icon: faTruck,
    color: "text-purple-500 bg-purple-100",
  },
  {
    label: "Delivered",
    value: "delivered",
    icon: faBoxOpen,
    color: "text-green-600 bg-green-100",
  },
  {
    label: "Cancelled",
    value: "cancelled",
    icon: faTimesCircle,
    color: "text-red-500 bg-red-100",
  },
];

export default function CustomStatusDropdown({ value, onChange }) {
  const selectedStatus =
    statuses.find((s) => s.value === value) || statuses[0];

  return (
      <Listbox value={value} onChange={onChange} >
        <div className="relative">
          <Listbox.Button
            className={`w-full flex items-center justify-between rounded px-6 py-2 ${selectedStatus.color} rounded-full caret-transparent`}
          >
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={selectedStatus.icon} />
              {selectedStatus.label}
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 w-full rounded bg-white border shadow-lg z-10">
            {statuses.map((status) => (
              <Listbox.Option
                key={status.value}
                value={status.value}
                className={({ active }) =>
                  `px-4 py-2 flex items-center gap-2 cursor-pointer caret-transparent ${
                    active ? "bg-gray-100" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={status.icon} className={status.color} />
                <span className="font-medium">{status.label}</span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
  );
}
