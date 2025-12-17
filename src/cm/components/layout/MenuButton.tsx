import React, {useCallback} from 'react'
import {Z_INDEX} from 'src/cm/lib/constants/constants'
import {MenuIcon} from 'lucide-react'

interface MenuButtonProps {
  onClick: () => void
  onMouseEnter?: () => void // オプション化
}

// スタイルをコンポーネント外に移動
const iconStyles = {
  zIndex: Z_INDEX.appBar,
} as const

export const MenuButton = React.memo<MenuButtonProps>(
  ({
    onClick,
    onMouseEnter = onClick, // デフォルトでonClickと同じ動作
  }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        onClick()
      },
      [onClick]
    )

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        onMouseEnter()
      },
      [onMouseEnter]
    )

    return (
      <button id="menu-btn" type="button" aria-label="メニューを開く">
        <MenuIcon
          style={iconStyles}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          className="text-primary-main mx-1 w-8 rounded-sm font-bold cursor-pointer"
        />
      </button>
    )
  }
)

MenuButton.displayName = 'MenuButton'
