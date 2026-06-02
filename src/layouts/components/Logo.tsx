import SvgIcon from '@/components/SvgIcon'

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-(--ant-color-primary)">
      <SvgIcon name="logo" size={24} />
      <span className="text-lg font-bold ">React Admin</span>
    </div>
  )
}

export default Logo
