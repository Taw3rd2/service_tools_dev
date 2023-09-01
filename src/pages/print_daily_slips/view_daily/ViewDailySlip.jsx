import { TextField } from "@mui/material";
import { getFormattedDate } from "../../../utilities/dateUtils";
import "../../../global_style/style.css";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firestore.utils";

const ViewDailySlip = ({ printData }) => {
  //const { customer } = props.children[1];

  console.log("printData: ", printData);

  const { dispatch } = printData;

  const [customerDocument, setCustomerDocument] = useState({});

  useEffect(() => {
    const customerReference = doc(db, "customers", dispatch.customerId);
    const getCustomerDocument = async () => {
      const cust = await getDoc(customerReference);
      setCustomerDocument({ ...cust.data(), id: cust.id });
    };
    getCustomerDocument();
  }, [dispatch.customerId]);

  return (
    <div className="viewSlipsContainer">
      <div className="viewSlipsRow">
        <div className="tripleRowInput">
          {/* Service Date */}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Service Date"
            value={getFormattedDate(dispatch.dateScheduled)}
            inputProps={{
              style: { fontSize: 14 },
            }}
            fullWidth
          />
        </div>
        <div className="tripleRowInput">
          {/* Lead Source */}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Lead Source"
            value={dispatch.leadSource}
            inputProps={{
              style: { fontSize: 14 },
            }}
            fullWidth
          />
        </div>
        <div className="tripleRowInput">
          {/* Call Taken By */}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Dispatcher"
            value={dispatch.takenBy}
            inputProps={{
              style: { fontSize: 14 },
            }}
            fullWidth
          />
        </div>
      </div>
      {dispatch.firstname ? (
        <div className="viewSlipsRow">
          <div className="singleRowInput">
            <div className="viewSlipsPrimaryText">
              {customerDocument.firstname} {customerDocument.lastname}
            </div>
          </div>
        </div>
      ) : (
        <div className="viewSlipsRow">
          <div className="singleRowInput">
            <div className="viewSlipsPrimaryText">
              {customerDocument.lastname}
            </div>
          </div>
        </div>
      )}

      <div className="viewSlipsRow">
        <div className="singleRowInput">
          {customerDocument.street ? (
            <>
              <div className="viewSlipsCaptionText">Address</div>
              <div className="viewSlipsSecondaryText">
                {customerDocument.street && `${customerDocument.street}`}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="viewSlipsRow">
        <div className="singleRowInput">
          {customerDocument.city ||
          customerDocument.state ||
          customerDocument.zip ? (
            <>
              <div className="viewSlipsSecondaryText">
                {`${customerDocument.city}, ${customerDocument.state} ${customerDocument.zip}`}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="viewSlipsRow">
        <div className="singleRowInput">
          {customerDocument.contacts ? (
            <>
              <div className="viewSlipsCaptionText">Primary Contact</div>
              <div className="viewSlipsPrimaryText">
                {customerDocument &&
                  customerDocument.contacts[0] &&
                  customerDocument.contacts[0].contactName &&
                  `${customerDocument.contacts[0].contactName}: `}
                {customerDocument &&
                  customerDocument.contacts[0] &&
                  customerDocument.contacts[0].contactPhone &&
                  `${customerDocument.contacts[0].contactPhone}`}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="viewSlipsRow">
        <div className="singleRowInput">
          {customerDocument.contacts ? (
            <>
              <div className="viewSlipsCaptionText">Alternate Contact</div>
              <div className="viewSlipsPrimaryText">
                {customerDocument &&
                  customerDocument.contacts[1] &&
                  customerDocument.contacts[1].contactName &&
                  `${customerDocument.contacts[1].contactName}: `}
                {customerDocument &&
                  customerDocument.contacts[1] &&
                  customerDocument.contacts[1].contactPhone &&
                  `${customerDocument.contacts[1].contactPhone}`}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="viewSlipsRow" style={{ marginTop: "8px" }}>
        <div className="doubleRowInput">
          {/*Work Selector*/}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Issue"
            value={dispatch.issue}
            inputProps={{
              style: { fontSize: 14 },
            }}
            fullWidth
          />
        </div>
        <div className="doubleRowInput">
          {/*Slotted Time*/}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Slotted Time"
            value={dispatch.timeAlotted}
            inputProps={{
              style: { fontSize: 14 },
            }}
            fullWidth
          />
        </div>
      </div>
      <div className="viewSlipsRow">
        <div className="tripleRowInput">
          {/*Tech Lead*/}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Tech Lead"
            value={dispatch.techLead}
            inputProps={{
              style: { fontSize: 14 },
            }}
            fullWidth
          />
        </div>
        <div className="tripleRowInput">
          {/*Tech helper*/}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Tech Helper"
            value={dispatch.techHelper}
            inputProps={{
              style: { fontSize: 14 },
            }}
            fullWidth
          />
        </div>
        <div className="tripleRowInput">
          {/*Payment*/}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Payment"
            value={dispatch.payment}
            inputProps={{
              style: { fontSize: 14 },
            }}
            fullWidth
          />
        </div>
      </div>
      <div className="viewSlipsRow">
        <div className="singleRowInput">
          {/* Notes */}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Notes (4 lines max for printable view)"
            rows="4"
            fullWidth
            multiline
            value={dispatch.notes}
          />
        </div>
      </div>
      <div className="viewSlipsRow">
        <div className="tripleRowInput">
          {/*Time Of Day*/}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Requested"
            value={dispatch.timeOfDay}
            inputProps={{
              style: { fontSize: 14 },
            }}
            fullWidth
          />
        </div>
        <div className="tripleRowInput"></div>
        <div className="tripleRowInput">
          {/*Job Number*/}
          <TextField
            margin="dense"
            size="small"
            variant="outlined"
            label="Job Number"
            value={dispatch.jobNumber}
            inputProps={{
              style: { fontSize: 14 },
            }}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

export default ViewDailySlip;
