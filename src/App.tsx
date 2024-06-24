import { useEffect, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import {
  Account,
  TariPermissions,
  TariUniverseProvider,
  TariUniverseProviderParameters,
  permissions as walletPermissions,
} from "@tariproject/tarijs";

const { TariPermissionAccountInfo, TariPermissionKeyList, TariPermissionSubstatesRead, TariPermissionTransactionSend } =
  walletPermissions

const permissions = new TariPermissions();
permissions.addPermission(new TariPermissionKeyList());
permissions.addPermission(new TariPermissionAccountInfo());
permissions.addPermission(new TariPermissionTransactionSend());
permissions.addPermission(new TariPermissionSubstatesRead());
const optionalPermissions = new TariPermissions();
const params: TariUniverseProviderParameters = {
  permissions: permissions,
  optionalPermissions,
};

const provider = new TariUniverseProvider(params);

type AccountDataResponse = {
  id: number | undefined;
  result: Account | undefined;
};

type ResizeResponse = {
  width: number;
  height: number;
};

function App() {
  const [accountData, setAccountData] = useState<Account | undefined>(undefined);
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  useEffect(() => {

    function getAccountData(event: MessageEvent<AccountDataResponse>) {
      setAccountData(event.data.result);
    }
    function handleResize(event: MessageEvent<ResizeResponse>) {
      setWidth(event.data.width)
      setHeight(event.data.height)
    }

    function handleEvent(event: MessageEvent) {
      if (event.data.type === "resize") {
        handleResize(event)
      } else {
        getAccountData(event)
      }
    }
    window.addEventListener(
      "message",
      (event) => handleEvent(event),
      false
    );
    provider.requestParentSize();
    
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" maxWidth={width} maxHeight={height}>
      <AccountTest accountData={accountData} />
    </Box>
  );
}

function AccountTest({ accountData }: { accountData: unknown }) {
  async function getAccountClick() {
    await provider.getAccount();
  }

  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{ padding: 3, borderRadius: 4 }}
    >
      <Stack direction="column" spacing={2}>
        <Button
          variant="contained"
          sx={{ width: "50%" }}
          onClick={async (event) => {
            event.preventDefault();
            await getAccountClick();
          }}
        >
          Get Account Data
        </Button>
        <Typography>Result: </Typography>
        <PrettyJson value={{ accountData }}></PrettyJson>
      </Stack>
    </Paper>
  );
}

function PrettyJson({ value }: Record<string, unknown>) {
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

export default App;
