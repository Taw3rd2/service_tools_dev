import { Card, CardContent, Stack, Typography } from "@mui/material";
import { getFormattedCompactDateAndTime } from "../../../../utilities/dateUtils";
import { useTheme } from "@mui/material/styles";

const DispatchLog = ({ dispatchLog }) => {
  const theme = useTheme();
  const copyOfDispatchLog = dispatchLog?.length ? dispatchLog : [];

  return copyOfDispatchLog.length > 0 ? (
    <div style={{ maxHeight: "467px", overflow: "auto" }}>
      {copyOfDispatchLog
        .sort((a, b) => b.sortingDate - a.sortingDate)
        .map((logEntry, index) => (
          <Card key={index} variant="elevation" sx={{ margin: "8px" }}>
            <Stack>
              <Typography color={theme.palette.primary.main}>
                {getFormattedCompactDateAndTime(logEntry.activityTime)}
              </Typography>
              <Typography variant="caption">{logEntry.name}</Typography>
              <Typography variant="caption">{logEntry.activity}</Typography>
            </Stack>
          </Card>
        ))}
    </div>
  ) : (
    <Card variant="elevation" sx={{ margin: "2px" }}>
      <CardContent>
        <Typography>No Log Entries</Typography>
      </CardContent>
    </Card>
  );
};

export default DispatchLog;
