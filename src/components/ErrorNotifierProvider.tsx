import {
  colors,
  makeStyles,
  Snackbar,
  SnackbarProps,
} from '@material-ui/core';
import {
  createContext,
  Key,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const useStyles = makeStyles({
  root: {
    background: colors.red[800],
  },
});

const ErrorNotifierContext = createContext<{
  showError:(message:string) => void
} | undefined>(undefined);

type SnackPack = {
  message: string
  key: Key
};

type ErrorNotifierProviderProps = {
  children?:ReactNode
};

export const ErrorNotifierProvider = ({ children }:ErrorNotifierProviderProps) => {
  const [snackPack, setSnackPack] = useState<SnackPack[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackPack | undefined>(undefined);
  const classes = useStyles();

  useEffect(() => {
    const spawnMessageFromQueue = () => {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    };

    if (snackPack.length && !messageInfo) {
      spawnMessageFromQueue();
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose: SnackbarProps['onClose'] = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const showError = (message: string) => {
    setSnackPack((prev) => ([
      ...prev,
      { message, key: new Date().getTime() },
    ]));
  };

  return (
    <ErrorNotifierContext.Provider
      value={{ showError }}
    >
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        ContentProps={{ classes: { root: classes.root } }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={3500}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
      />
      {children}
    </ErrorNotifierContext.Provider>
  );
};

export const useErrorNotifier = () => {
  const errorNotifier = useContext(ErrorNotifierContext);
  if (!errorNotifier) throw new Error('errorNotifier should only be used within an ErrorNifierProvider');
  return errorNotifier;
};
