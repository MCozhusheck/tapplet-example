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

function App() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  async function resize() {
    console.log("resize")
    const {width, height } = await provider.requestParentSize();
    console.log("resize", width, height)
    setWidth(width)
    setHeight(height)
  }
  useEffect(() => {
    resize();
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" maxWidth={width} maxHeight={height}>
      <AccountTest />
    </Box>
  );
}

function AccountTest() {
  const [accountData, setAccountData] = useState<Account | undefined>(undefined);
  async function getAccountClick() {
    const acc = await provider.getAccount();
    setAccountData(acc);
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
