import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from '../config/config'
import state from '../store'
import { download } from '../assets'
import { downloadCanvasToImage, reader } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AIPicker, Tab, CustomButton, ColorPicker, FilePicker } from '../components'

const Customizer = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const snap = useSnapshot(state);
  const [file, setFile] = React.useState('');
  const [prompt, setPrompt] = React.useState('');
  const [generatingImg, setGeneratingImg] = React.useState(false);
  const [activeEditorTab, setActiveEditorTab] = React.useState('');
  const [activeFilterTab, setActiveFilterTab] = React.useState({
    logoShirt: true,
    stylishShirt: false
  })

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />
      case 'filepicker':
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case 'aipicker':
        return <AIPicker />
      default:
        return null;
    }
  }

  const handleDecal = (type, res) => {
    const decalType = DecalTypes[type]

    state[decalType.stateProperty] = res

    if (!isFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName]
        break;
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName]
      default:
        state.isLogoTexture = true
        state.isFullTexture = false
    }

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then(res => {
        handleDecal(type, res)
        setActiveEditorTab('')
      })
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key='custom'
            className='absolute left-0 top-0 z-10'
            {...slideAnimation('left')}
          >
            <div className='flex items-center min-h-screen'>
              <div className='editortabs-container tabs'>
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div className='absolute z-10 top-5 right-5'
            {...fadeAnimation}
          >
            <CustomButton
              type='filled'
              title='Back'
              handleClick={() => state.intro = true}
              customStyles='w-fit px-4 py-2.5 font-bold text-sm'
            />
          </motion.div>

          <motion.div className='filtertabs-container' {...slideAnimation('up')}>
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer