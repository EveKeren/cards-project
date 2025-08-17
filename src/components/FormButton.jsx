import Button from "@mui/material/Button";

export default function FormButton({
  sx = {},
  variant = "contained",
  size = "medium",
  ...props
}) {
  return (
    <Button
      variant={variant}
      size={size}
      disableElevation
      {...props}
      sx={{
        minWidth: 120,
        px: 3,
        borderRadius: 2,
        flex: "0 0 auto",
        width: "auto",
        ...sx,
      }}
    />
  );
}
