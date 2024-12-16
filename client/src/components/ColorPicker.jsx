import React from 'react'
import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'

import state from '../store'

const ColorPicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className='absolute left-full ml-3'>
      <SketchPicker
        color={snap.color}
        disableAlpha
        onChange={(color) => state.color = color.hex}
        presetColors={[
          '#FFFFFF', '#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#800080', '#000000', '#808080'
        ]}
      />
    </div>
  )
}

export default ColorPicker