import { useRef, useState } from "react";
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

function App() {
  const provider = useRef<TariUniverseProvider>(new TariUniverseProvider(params));

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%">
      <AccountTest provider={provider.current}/>
    </Box>
  );
}

function AccountTest({provider}: {provider: TariUniverseProvider}) {
  const [accountData, setAccountData] = useState<Account | undefined>(undefined);
  async function getAccountClick() {
    const acc = await provider.getAccount();
    setAccountData(acc)
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
