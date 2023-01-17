import scss from "./AppComp.module.scss";

export const AppContainer = ({ children }) => {
  return <div className={scss.container}>{children}</div>;
};

export const AppButton = ({ children, link, color, type, ...props }) => {
  return (
    <button
      {...props}
      type={type || "button"}
      className={`${scss.button} ${scss[color]}`}
    >
      {children}
    </button>
  );
};
