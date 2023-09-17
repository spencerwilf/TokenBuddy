import ConnectButton from './components/ConnectButton'
import './globals.css'
import TokenForm from './components/TokenForm'

export default function Home() {
  return (
   <div>
    <div className="mt-2 navbar  flex justify-around">
  <a className="font-retro text-white text-5xl btn btn-ghost normal-case ">TokenBuddy</a>
  <ConnectButton/>
</div>
<TokenForm/>
   </div>
  )
}
