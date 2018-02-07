using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NotificationHub.Models;

namespace NotificationHub.Controllers
{
    public class HubController : Controller
    {
        private readonly NotificationHubContext _context;
        //webhook get, pass response to View(WebHookObj);
        public HubController(NotificationHubContext context)
        {
            _context = context;
        }

        // GET: Hub
        public async Task<IActionResult> Index()
        {
            return View(await _context.Hub.ToListAsync());
        }

        // GET: Hub/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var hub = await _context.Hub
                .SingleOrDefaultAsync(m => m.ID == id);
            if (hub == null)
            {
                return NotFound();
            }
            
            return View(hub);
        }

        // GET: Hub/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Hub/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Organization,Release,Commit")] Hub hub)
        {
            if (ModelState.IsValid)
            {
                _context.Add(hub);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(hub);
        }

        // GET: Hub/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var hub = await _context.Hub.SingleOrDefaultAsync(m => m.ID == id);
            if (hub == null)
            {
                return NotFound();
            }
            return View(hub);
        }

        // POST: Hub/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,Organization,Release,Commit")] Hub hub)
        {
            if (id != hub.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(hub);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!HubExists(hub.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(hub);
        }

        // GET: Hub/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var hub = await _context.Hub
                .SingleOrDefaultAsync(m => m.ID == id);
            if (hub == null)
            {
                return NotFound();
            }

            return View(hub);
        }

        // POST: Hub/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var hub = await _context.Hub.SingleOrDefaultAsync(m => m.ID == id);
            _context.Hub.Remove(hub);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool HubExists(int id)
        {
            return _context.Hub.Any(e => e.ID == id);
        }
    }
}
