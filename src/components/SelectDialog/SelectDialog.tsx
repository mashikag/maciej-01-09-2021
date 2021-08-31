import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  selectItem: {
    width: 200,
  },
  centeredTitle: {
    textAlign: 'center',
  },
  paddedDialog: {
    paddingBottom: 32,
    paddingLeft: 32,
    paddingRight: 32,
  },
});

export type Option<T> = { label: string, value: T };

type SelectDialogProps<T = string> = {
  onClose: () => void
  onSelected: (value: T) => void
  open: boolean
  options: Option<T>[]
  selected: T
  title: string
};

const SelectDialog = <T extends unknown>({
  onClose, onSelected, open, options, selected, title,
}: SelectDialogProps<T>) => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.centeredTitle}>{title}</DialogTitle>
      <DialogContent className={classes.paddedDialog}>
        <ButtonGroup
          orientation="vertical"
          color="primary"
          variant="contained"
          size="large"
        >
          {options.map(({ label, value }) => (
            <Button
              key={String(value)}
              className={classes.selectItem}
              onClick={() => {
                onSelected(value);
                onClose();
              }}
              disabled={selected === value}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  );
};

export default SelectDialog;
