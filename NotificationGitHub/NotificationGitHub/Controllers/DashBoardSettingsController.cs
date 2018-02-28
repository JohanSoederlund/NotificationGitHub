using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NotificationGitHub.Data;
using NotificationGitHub.Models.DashBoardViewModels;


namespace NotificationGitHub.Controllers
{
    public class DashBoardSettingsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DashBoardSettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: DashBoardSettings
        public async Task<IActionResult> Index()
        {
            //var _userManager = ManageController.
            //var user = await _userManager.GetUserAsync(User);

            return View(await _context.DashBoardSettingsViewModel.ToListAsync());
        }

        // GET: DashBoardSettings/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dashBoardSettingsViewModel = await _context.DashBoardSettingsViewModel
                .SingleOrDefaultAsync(m => m.ID == id);
            if (dashBoardSettingsViewModel == null)
            {
                return NotFound();
            }

            return View(dashBoardSettingsViewModel);
        }

        // GET: DashBoardSettings/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: DashBoardSettings/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,UserID,OrganizationName,Release,Repo,Commit")] DashBoardSettingsViewModel dashBoardSettingsViewModel)
        {
            if (ModelState.IsValid)
            {
                _context.Add(dashBoardSettingsViewModel);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(dashBoardSettingsViewModel);
        }

        // GET: DashBoardSettings/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dashBoardSettingsViewModel = await _context.DashBoardSettingsViewModel.SingleOrDefaultAsync(m => m.ID == id);
            if (dashBoardSettingsViewModel == null)
            {
                return NotFound();
            }
            return View(dashBoardSettingsViewModel);
        }

        // POST: DashBoardSettings/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,UserID,OrganizationName,Release,Repo,Commit")] DashBoardSettingsViewModel dashBoardSettingsViewModel)
        {
            if (id != dashBoardSettingsViewModel.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(dashBoardSettingsViewModel);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DashBoardSettingsViewModelExists(dashBoardSettingsViewModel.ID))
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
            return View(dashBoardSettingsViewModel);
        }

        // GET: DashBoardSettings/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dashBoardSettingsViewModel = await _context.DashBoardSettingsViewModel
                .SingleOrDefaultAsync(m => m.ID == id);
            if (dashBoardSettingsViewModel == null)
            {
                return NotFound();
            }

            return View(dashBoardSettingsViewModel);
        }

        // POST: DashBoardSettings/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var dashBoardSettingsViewModel = await _context.DashBoardSettingsViewModel.SingleOrDefaultAsync(m => m.ID == id);
            _context.DashBoardSettingsViewModel.Remove(dashBoardSettingsViewModel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool DashBoardSettingsViewModelExists(int id)
        {
            return _context.DashBoardSettingsViewModel.Any(e => e.ID == id);
        }
    }
}
