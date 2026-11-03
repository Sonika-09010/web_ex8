import { useState, useCallback, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Student from './components/Student'
import GuestCounter from './components/GuestCounter'
import Employee from './components/Employee'
import RSVPForm from './components/RSVPForm'
import Product from './components/Product'
import ShoppingCart from './components/ShoppingCart'
import Footer from './components/Footer'

import students from './data/students'
import employees from './data/employees'
import products from './data/products'

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <div className="divider" aria-hidden="true">
        <span className="divider__heart">♥</span>
      </div>
      {text && <p className="section-heading__text">{text}</p>}
    </div>
  )
}

function App() {
  const [cart, setCart] = useState([])
  const [showTop, setShowTop] = useState(false)

  // Show the Back to Top button after scrolling down
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // useCallback keeps the same function reference between renders, so the
  // memoized <Product /> components are NOT re-rendered every time the cart changes.
  // The functional update (prev => ...) means we don't need `cart` as a dependency.
  const handleAddToCart = useCallback((productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product || !product.available) return

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId)
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }, [])

  // Removes one unit; deletes the line when quantity reaches zero
  const handleRemoveFromCart = useCallback((productId) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    )
  }, [])

  const handleClearCart = useCallback(() => setCart([]), [])

  return (
    <>
      <Navbar />

      <main>
        <Hero />

        {/* Question 1 */}
        <section id="party" className="section">
          <SectionHeading
            eyebrow="The people who make it special"
            title="Our Wedding Party"
          />
          <div className="grid grid--3">
            {students.map((s) => (
              <Student
                key={s.id}
                name={s.name}
                registerNo={s.registerNo}
                department={s.department}
                role={s.role}
                initials={s.initials}
              />
            ))}
          </div>
        </section>

        {/* Question 2 */}
        <section id="guests" className="section section--tint">
          <SectionHeading
            eyebrow="Guest counter"
            title="Count the Joy"
            text="Tap to keep a tally of the loved ones joining us on the big day."
          />
          <GuestCounter />
        </section>

        {/* Question 3 */}
        <section id="team" className="section">
          <SectionHeading
            eyebrow="Behind the scenes"
            title="Meet Our Wedding Planning Team"
            text="The artists and organisers bringing our celebration to life."
          />
          <div className="grid grid--4">
            {employees.map((emp) => (
              <Employee
                key={emp.id}
                name={emp.name}
                department={emp.department}
                active={emp.active}
              />
            ))}
          </div>
        </section>

        {/* Question 4 */}
        <section id="rsvp" className="section section--tint">
          <SectionHeading
            eyebrow="Kindly respond"
            title="RSVP"
            text="Please let us know you are coming by filling in the details below."
          />
          <RSVPForm />
        </section>

        {/* Question 5 */}
        <section id="gifts" className="section">
          <SectionHeading
            eyebrow="Wedding gift shop"
            title="Choose a Gift"
            text="Select thoughtful gifts for the couple and add them to your cart."
          />
          <div className="shop">
            <div className="grid grid--products">
              {products.map((p) => (
                <Product
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  available={p.available}
                  icon={p.icon}
                  onAdd={handleAddToCart}
                />
              ))}
            </div>
            <ShoppingCart
              cart={cart}
              onRemove={handleRemoveFromCart}
              onClear={handleClearCart}
            />
          </div>
        </section>
      </main>

      <Footer />

      {showTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </>
  )
}

export default App
