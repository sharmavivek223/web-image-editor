import { useCallback, useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from 'react-filerobot-image-editor';

function App() {
  const [designs, setDesigns] = useState([]);
  const [activeDesign, setActiveDesign] = useState();
  const [isImgEditorShown, setIsImgEditorShown] = useState(false);

  const openImgEditor = () => {
    setIsImgEditorShown(true);
  };

  const closeImgEditor = () => {
    setIsImgEditorShown(false);
  };

  const saveHandler = (editedImageObject, designState) => {
    console.log('saved', editedImageObject, designState);
    const oldState = JSON.parse(localStorage.getItem('designState'));
    localStorage.setItem(
      'designState',
      JSON.stringify([
        ...(oldState || []),
        { ...designState, imageObj: editedImageObject },
      ])
    );

    setDesigns((prev) => [...prev, designState]);
  };

  useEffect(() => {
    const designStates = JSON.parse(localStorage.getItem('designState'));
    if (designStates?.length) {
      setDesigns(designStates);
    }
  }, []);

  const handleDownload = useCallback((i) => {
    const imgObj = designs[i]?.imageObj;
    var a = document.createElement('a'); //Create <a>
    a.href = imgObj.imageBase64; //Image Base64 Goes here
    a.download = imgObj.fullName; //File name Here
    a.click(); //Downloaded file
  }, []);
  return (
    <div className="App">
      <button onClick={openImgEditor}>Open Filerobot image editor</button>
      {isImgEditorShown && (
        <FilerobotImageEditor
          key={activeDesign}
          loadableDesignState={designs[activeDesign] || {}}
          source="https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg"
          onSave={saveHandler}
          onClose={closeImgEditor}
          annotationsCommon={{
            fill: '#ff0000',
          }}
          Text={{ text: 'Filerobot...' }}
          Rotate={{ angle: 90, componentType: 'slider' }}
          Crop={{
            presetsItems: [
              {
                titleKey: 'classicTv',
                descriptionKey: '4:3',
                ratio: 4 / 3,
                // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
              },
              {
                titleKey: 'cinemascope',
                descriptionKey: '21:9',
                ratio: 21 / 9,
                // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
              },
            ],
            presetsFolders: [
              {
                titleKey: 'socialMedia', // will be translated into Social Media as backend contains this translation key
                // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
                groups: [
                  {
                    titleKey: 'facebook',
                    items: [
                      {
                        titleKey: 'profile',
                        width: 180,
                        height: 180,
                        descriptionKey: 'fbProfileSize',
                      },
                      {
                        titleKey: 'coverPhoto',
                        width: 820,
                        height: 312,
                        descriptionKey: 'fbCoverPhotoSize',
                      },
                    ],
                  },
                ],
              },
            ],
          }}
          tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK]} // or {['Adjust', 'Annotate', 'Watermark']}
          defaultTabId={TABS.ANNOTATE} // or 'Annotate'
          defaultToolId={TOOLS.TEXT} // or 'Text'
        />
      )}
      {!!designs.length && (
        <div>
          {designs.map((el, i) => (
            <div className="design" key={i}>
              {`${i + 1}. `}
              {el?.imageObj?.name}{' '}
              <button onClick={() => setActiveDesign(i)}>Load</button>{' '}
              <button onClick={() => handleDownload(i)}>Download</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
