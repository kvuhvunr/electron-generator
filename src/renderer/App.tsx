import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';
// import { TreeItem, TreeView } from '@mui/x-tree-view';
import FolderTree from '../FolderTree/FolderTree';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Hello() {
  return (
    <div>
      <div className="Hello">
        {/* <img width="200" alt="icon" src={icon} /> */}
      </div>
      {/* <h1>AI Generate Tool</h1> */}

      <div className="Hello">
        {/* <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a> */}

        {/* <TreeView
          aria-label="file system navigator"
          // defaultCollapseIcon={<ExpandMoreIcon />}
          // defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          <TreeItem nodeId="1" label="Applications">
            <TreeItem nodeId="2" label="Calendar" />
          </TreeItem>
          <TreeItem nodeId="5" label="Documents">
            <TreeItem nodeId="10" label="OSS" />
            <TreeItem nodeId="6" label="MUI">
              <TreeItem nodeId="8" label="index.js" />
            </TreeItem>
          </TreeItem>
        </TreeView> */}
        <div className="Tree">
          <FolderTree />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
