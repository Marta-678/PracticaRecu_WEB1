import Link from "next/link";

export default function NavBar({links}){
    return (
        <nav>
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
    )
}