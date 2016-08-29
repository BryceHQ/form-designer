import Col from './common/col';
import Row from './common/row';
import Form from './form';
import Datagrid from './datagrid';
import LabeledTextbox from './labeledTextbox';
import LabeledRadio from './labeledRadio';
import LabeledCheckbox from './labeledCheckbox';
import LabeledCombobox from './labeledCombobox';
import LabeledDatebox from './labeledDatebox';
import LabeledDateboxRange from './labeledDateboxRange';

import Alert from '../common/alert';

const form = {
  Form: Form,
  Col: Col,
  Row: Row,

  // Datagrid: Datagrid(Container, true),

  LabeledTextbox: LabeledTextbox,
  LabeledRadio: LabeledRadio,
  LabeledCheckbox: LabeledCheckbox,
  LabeledCombobox: LabeledCombobox,
  LabeledDatebox: LabeledDatebox,
  LabeledDateboxRange: LabeledDateboxRange,

  Alert: Alert,
};

export default form;
