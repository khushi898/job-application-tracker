import { Link } from "react-router-dom";

// One button style everywhere. Renders a router Link with `to`,
// an external link with `href`, and a normal <button> otherwise.
function Button({
  variant = "primary",
  size = "md",
  to,
  href,
  className = "",
  children,
  ...rest
}) {
  const classes = `btn btn-${variant} btn-${size} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
