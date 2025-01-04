import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import Select from "react-select";
import statesData from "../../assets/states.json";
import "./index.css";

interface CheckboxInputProps {
  item: { label: string; id: string };
  onChange?: (checked: boolean) => void;
  name: string;
}

function CheckboxInput({ item, onChange, name }: CheckboxInputProps) {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div className="checkbox-combiner">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        className="form-check-input"
        onChange={handleCheckboxChange}
      />
      <label className="form-check-label">{item.label || "Checkbox"}</label>
    </div>
  );
}

interface CheckboxInputListProps {
  label?: string;
  name: string;
  onChange?: (checked: boolean) => void;
  items: Array<{ label: string; id: string }>;
}

function CheckboxInputList({ label, name, onChange, items }: CheckboxInputListProps) {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div className="radio-check-list-container">
      <label>{label || "Checkbox Buttons"}</label>
      <div className="checkbox-container form-check">
        {items &&
          items.map((item) => <CheckboxInput key={item.id} item={item} name={name} onChange={handleCheckboxChange} />)}
      </div>
    </div>
  );
}

interface DateInputProps {
  label?: string;
  value?: string;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  min?: string;
}

const DateInput = ({ label, value, required, onChange, setValue, min }: DateInputProps) => {
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue && setValue(e.target.value);
    onChange && onChange(e);
  };
  return (
    <div className="input-container">
      <input
        value={value || ""}
        onChange={handleDateChange}
        type="date"
        {...(required && { required: true })}
        {...(min && { min: min })}
      />
      <label className="label-floated">
        {label || "Date"}
        {required && <span className="required">*</span>}
      </label>
    </div>
  );
};

const DateTimeInput = ({ label, value, required, onChange }: DateInputProps) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange && onChange(e);
  };

  return (
    <div className="input-container">
      <input
        value={inputValue}
        onChange={handleDateChange}
        type="datetime-local"
        {...(required && { required: true })}
      />
      <label className="label-floated">
        {label || "Date & Time"}
        {required && <span className="required">*</span>}
      </label>
    </div>
  );
};

interface TextInputProps {
  required?: boolean;
  label?: string;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

function DivisionSelectorInput({ required, options, setValue, value, onChange, width }: SelectorInputProps) {
  const [focused, setFocused] = useState(false);
  const labelClass = "label-floated";
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "---") {
      setValue && setValue(e.target.value);
      onChange && onChange(e);
    }
  };

  return (
    <div className={"input-container min-w-5" + width} style={{ minWidth: "9rem" }}>
      <select
        id="selector"
        name="selector"
        value={value}
        onChange={handleSelectChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...(required && { required: true })}
        className="minimal"
        style={{ paddingTop: "0px" }}
      >
        {options &&
          options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
      </select>
    </div>
  );
}

function DollarInput({ required, label, value, setValue, onChange, disabled }: TextInputProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [focused, setFocused] = useState(false);

  const labelClass = focused || inputValue ? "dollar-label-floated" : "dollar-text-label";

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  }

  return (
    <div className="input-container">
      <div className="input-group mb-3">
        <span className="input-group-text">$</span>
        <input
          type="text"
          className="form-control"
          aria-label="Amount (to the nearest dollar)"
          value={inputValue}
          onChange={onInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...(required && { required: true })}
        />
      </div>
      <label className={labelClass}>
        {label || "Test Input"}
        {required && <span className="required">*</span>}
      </label>
    </div>
  );
}

function EmailInput({ required, label, value, setValue }: TextInputProps) {
  const [focused, setFocused] = useState(false);

  const labelClass = focused || value ? "label-floated" : "text-label";

  return (
    <div className="input-container">
      <input
        type="email"
        className="icon-right"
        value={value || ""}
        onChange={(e) => setValue!(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      ></input>
      <label className={labelClass}>Email</label>
    </div>
  );
}

interface FormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

function Form({ children, onSubmit }: FormProps) {
  return (
    <div className="form-container">
      <form className="form" onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
}

interface FormGroupProps {
  title: string;
  children: ReactNode;
}

function FormGroup({ title, children }: FormGroupProps) {
  return (
    <div className="form-group">
      {title && <h3 className="group-title">{title}</h3>}

      <div className="form-items">
        {React.Children.map(children, (child, index) => (
          <div key={index} className="form-item">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

interface FormRowProps {
  children: ReactNode;
  className?: string;
}

function FormRow({ children, className }: FormRowProps) {
  return <div className={`form-row ${className || ""}`}>{children}</div>;
}

interface ImageProps {
  label?: string;
  setValue?: React.Dispatch<React.SetStateAction<File | null>>;
  setURLValue?: React.Dispatch<React.SetStateAction<string>>;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
function ImageInput({ setValue, setURLValue, onChange, required }: ImageProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const fileBlob = event.target.files?.[0];
    if (fileBlob) {
      onChange && onChange(event);
      setValue && setValue(fileBlob);
      setURLValue && setURLValue(URL.createObjectURL(fileBlob));
    }
  }

  return (
    <div className="img-input-container">
      <input
        type="file"
        id="images"
        accept="image/*"
        {...(required && { required: true })}
        onChange={handleChange}
      ></input>
      {/* {file && <img src={file} className="circular-img" alt="preview" />} */}
      {/* <label htmlFor="images">Click me to upload image</label> */}
    </div>
  );
}

function NewImageInput({ setValue, setURLValue, onChange, required, label }: ImageProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const fileBlob = event.target.files?.[0];
    if (fileBlob) {
      onChange && onChange(event);
      setValue && setValue(fileBlob);
      setURLValue && setURLValue(URL.createObjectURL(fileBlob));
    }
  }
  return (
    <div className="d-flex">
      <label className="file">
        <input type="file" id="file" accept="image/*" {...(required && { required: true })} onChange={handleChange} />
        <span className="file-custom">
          {label || "Click me to upload image"}
          {required && <span className="required">*</span>}
        </span>
      </label>
    </div>
  );
}

interface NumberInputProps {
  label?: string;
  required?: boolean;
}

function NumberInput({ label, required }: NumberInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

  const labelClass = focused || inputValue ? "label-floated" : "text-label";

  return (
    <div className="input-container">
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...(required && { required: true })}
      ></input>
      <label className={labelClass}>
        {label || "Number"}
        {required && <span className="required">*</span>}
      </label>
    </div>
  );
}

interface PasswordInputProps {
  required?: boolean;
}

function PasswordInput({ required }: PasswordInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

  const labelClass = focused || inputValue ? "label-floated" : "text-label";

  return (
    <div className="input-container">
      <input
        type="password"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...(required && { required: true })}
      ></input>
      <label className={labelClass}>Password {required && <span className="required">*</span>}</label>
    </div>
  );
}

function PhoneInput({ required, label, value, setValue, disabled }: TextInputProps) {
  const [focused, setFocused] = useState(false);

  const labelClass = focused || value ? "label-floated" : "text-label";

  return (
    <div className="input-container">
      <input
        type="tel"
        className="icon-right"
        value={value || ""}
        onChange={(e) => setValue!(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      ></input>
      <label className={labelClass}>Phone</label>
    </div>
  );
}

interface RadioButtonProps {
  item: { label: string; id: string };
  name: string;
}

const RadioButton = ({ item, name }: RadioButtonProps) => {
  const [selectedItem, setSelectedItem] = useState("");

  const handleSelectionChange = (value: string) => {
    setSelectedItem(value);
  };
  return (
    <>
      <input
        type="radio"
        id={item.id}
        name={name}
        value={item.label}
        checked={selectedItem === item.label}
        onChange={() => handleSelectionChange(item.label)}
      />
      <label htmlFor={item.id} style={{ width: "100%" }} onClick={() => handleSelectionChange(item.label)}>
        {item.label}
      </label>
    </>
  );
};

interface RadioButtonListProps {
  items: Array<{ label: string; id: string }>;
  name: string;
  label?: string;
}

const RadioButtonList = ({ items, name, label }: RadioButtonListProps) => {
  return (
    <div className="radio-check-list-container">
      <label>{label || "Radio Buttons"}</label>
      <div className="radio-container">
        {items && items.map((item) => <RadioButton key={item.id} item={item} name={name} />)}
      </div>
    </div>
  );
};

interface SearchInputProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  fakeValue: string;
  setFakeValue: React.Dispatch<React.SetStateAction<string>>;
  possibleSuggestions?: AutoCompleteSuggestion[];
}

function SearchInput({ setValue, value, fakeValue, setFakeValue, possibleSuggestions }: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState("CLOSED");
  const [labelClass, setLabelClass] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setFakeValue(inputValue);
    setValue("");
    if (inputValue) {
      setFocused(true);
      setStatus("OPEN");
    } else {
      setFocused(false);
      setStatus("CLOSED");
    }
  };

  const handleSelect = (suggestion: AutoCompleteSuggestion) => {
    setValue(suggestion.item_id);
    setFakeValue(suggestion.main_text);
    setLabelClass("label-focused");
    setFocused(false);
    setStatus("CLOSED");
  };

  const renderSuggestions = (): ReactNode => {
    if (status === "OPEN" && possibleSuggestions) {
      return (
        <ul className="list-unstyled p-0 m-0 shadow-sm suggestion-list-mt0">
          {possibleSuggestions.map((suggestion: AutoCompleteSuggestion) => {
            const { item_id, main_text, secondary_text } = suggestion;

            return (
              <li
                className="p-2 suggestion-item cursor-pointer overflow-hidden"
                key={item_id}
                onClick={() => handleSelect(suggestion)}
              >
                <strong>{main_text} </strong>
                <small> ({secondary_text})</small>
              </li>
            );
          })}
        </ul>
      );
    } else {
      return null;
    }
  };
  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const clearSuggestions = () => {
    setStatus("CLOSED");
  };

  const handleFocus = (val: boolean) => {
    setFocused(val);
    if (val) {
      setLabelClass("label-focused");
    } else {
      setLabelClass("");
    }
  };

  return (
    <div className="search-container" ref={ref}>
      <input
        type="search"
        value={fakeValue}
        onChange={handleInput}
        onFocus={() => handleFocus(true)}
        onBlur={() => handleFocus(false)}
        placeholder="Search"
        className={`search-input icon-left ${focused || fakeValue ? "label-focused" : ""}`}
        style={{ paddingLeft: focused || fakeValue ? "" : "var(--icon-padding)" }}
      />
      <input type="hidden" name="hiddenSearch" value={value} onChange={(e) => setValue(e.target.value)} />
      {renderSuggestions()}
    </div>
  );
}

interface SelectorInputProps {
  label?: string;
  required?: boolean;
  options?: Array<{ name: string; id: string }>;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  width?: string;
  defaultValue?: boolean;
}

function SelectorInput({
  label,
  required,
  options,
  setValue,
  value,
  onChange,
  width,
  defaultValue = true,
}: SelectorInputProps) {
  const [focused, setFocused] = useState(false);
  const labelClass = "label-floated";
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue && setValue(e.target.value);
    onChange && onChange(e);
  };

  return (
    <div className={"input-container min-w-5" + width}>
      <label className={labelClass}>{label || "Select an option"}</label>

      <select
        id="selector"
        name="selector"
        value={value || ""}
        onChange={handleSelectChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...(required && { required: true })}
        className="minimal"
      >
        {defaultValue && <option value="">---</option>}
        {options &&
          options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
      </select>
    </div>
  );
}

interface Option {
  value: string;
  label: string;
}
interface Test2MultiSelectorProps {
  label?: string;
  required?: boolean;
  options?: Array<Option>;
  setValue?: React.Dispatch<React.SetStateAction<readonly Option[]>>;
  defaultValue?: Array<Option>;
  onChange?: any;
}

function Test2MultiSelector({ label, required, options, setValue, defaultValue, onChange }: Test2MultiSelectorProps) {
  const handleSelectChange = (selectedValue: readonly Option[]) => {
    setValue && setValue(selectedValue);
    onChange && onChange(selectedValue);
  };

  return (
    <div className="select-container">
      <Select
        defaultValue={defaultValue}
        isMulti
        name="colors"
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleSelectChange}
      />
      <label className="label-floated-multi">
        {label || "Select an option"}
        {required && <span className="required">*</span>}
      </label>
    </div>
  );
}

interface StateOption {
  id: string;
  name: string;
}

interface StateSelectorInputProps {
  label?: string;
  required?: boolean;
  options?: StateOption[]; // Use "?" to denote optional property
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

function StateSelectorInput({
  label,
  required,
  options = statesData as StateOption[],
  value,
  onChange,
}: StateSelectorInputProps) {
  const [selectedOption, setSelectedOption] = useState(value || "");

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
    onChange && onChange(e);
  };

  return (
    <SelectorInput
      label={label}
      required={required}
      options={options}
      value={selectedOption}
      onChange={handleSelectChange}
    />
  );
}

interface TextInputProps {
  required?: boolean;
  label?: string;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

function TextInput({ required, label, value, setValue, onChange, disabled }: TextInputProps) {
  const [focused, setFocused] = useState(false);

  const labelClass = focused || value ? "label-floated" : "text-label";

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (setValue) {
      setValue(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  }

  return (
    <div className="input-container">
      <input
        value={value || ""}
        onChange={onInputChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...(required && { required: true })}
        disabled={disabled || false}
      />
      <label className={labelClass}>
        {label || "Test Input"}
        {required && <span className="required">*</span>}
      </label>
    </div>
  );
}

interface TextAreaProps {
  required?: boolean;
  label?: string;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}
function TestInput2({ required, label, value, onChange }: TextInputProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [focused, setFocused] = useState(false);

  const labelClass = focused || inputValue ? "label-floated" : "text-label";

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  }

  return (
    <div className="input-container">
      <input
        value={inputValue}
        onChange={onInputChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...(required && { required: true })}
      />
      <label className={labelClass}>
        {label || "Test Input"}
        {required && <span className="required">*</span>}
      </label>
    </div>
  );
}

function TextAreaInput({ required, label, value, setValue, onChange }: TextAreaProps) {
  const [focused, setFocused] = useState(false);

  const labelClass = focused || value ? "label-floated" : "text-label";

  function onInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (setValue) {
      setValue!(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  }

  return (
    <div className="input-container">
      <textarea
        rows={3}
        placeholder="Enter comment..."
        value={value}
        className="text-area"
        onChange={onInputChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...(required && { required: true })}
        maxLength={1000}
      ></textarea>
      <label className={labelClass}>
        {label || "Test Input"}
        {required && <span className="required">*</span>}
      </label>
    </div>
  );
}

interface TimeInputProps {
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
const TimeInput = ({ label, required, value, onChange }: TimeInputProps) => {
  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e);
  };

  return (
    <div className="input-container">
      <input type="time" value={value || ""} onChange={handleTimeChange} {...(required && { required: true })} />
      <label className="label-floated">
        {label || "Time"}
        {required && <span className="required">*</span>}
      </label>
    </div>
  );
};

export {
  CheckboxInput,
  CheckboxInputList,
  DateInput,
  DateTimeInput,
  DivisionSelectorInput,
  DollarInput,
  EmailInput,
  Form,
  FormGroup,
  FormRow,
  ImageInput,
  NewImageInput,
  NumberInput,
  PasswordInput,
  PhoneInput,
  RadioButton,
  RadioButtonList,
  SearchInput,
  SelectorInput,
  StateSelectorInput,
  Test2MultiSelector,
  TestInput2,
  TextAreaInput,
  TextInput,
  TimeInput,
};
